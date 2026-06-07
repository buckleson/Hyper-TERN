import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenantCacheService } from './tenant-cache.service';
import { Tenant } from '../../entities/tenant.entity';

describe('TenantCacheService', () => {
  let service: TenantCacheService;
  let mockFindOne: jest.Mock;
  let mockInsert: jest.Mock;

  beforeEach(async () => {
    mockFindOne = jest.fn();
    mockInsert = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantCacheService,
        { provide: getRepositoryToken(Tenant), useValue: { findOne: mockFindOne, insert: mockInsert } },
      ],
    }).compile();
    service = module.get<TenantCacheService>(TenantCacheService);
  });

  it('returns tenantId when the tenant exists', async () => {
    mockFindOne.mockResolvedValueOnce({ id: 'tenant-abc', name: 'user-1' });
    expect(await service.resolve('user-1')).toBe('tenant-abc');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: 'user-1' } });
  });

  it('returns null when the tenant is missing', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    expect(await service.resolve('unknown')).toBeNull();
  });

  it('caches subsequent lookups for the same user', async () => {
    mockFindOne.mockResolvedValueOnce({ id: 'tenant-abc' });
    await service.resolve('user-1');
    await service.resolve('user-1');
    expect(mockFindOne).toHaveBeenCalledTimes(1);
  });

  it('creates a missing tenant when ensured', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    mockInsert.mockResolvedValueOnce(undefined);

    const tenantId = await service.ensure('user-1');

    expect(tenantId).toEqual(expect.any(String));
    expect(mockInsert).toHaveBeenCalledWith({
      id: tenantId,
      name: 'user-1',
      organization_name: null,
      email: null,
      is_active: true,
    });
    expect(await service.resolve('user-1')).toBe(tenantId);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
  });

  it('returns the existing tenant if create races another request', async () => {
    mockFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'tenant-existing' });
    mockInsert.mockRejectedValueOnce(new Error('duplicate'));

    await expect(service.ensure('user-1')).resolves.toBe('tenant-existing');
  });
});
