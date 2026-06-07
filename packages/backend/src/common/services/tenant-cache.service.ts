import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Tenant } from '../../entities/tenant.entity';
import { TtlFifoCache } from '../utils/ttl-fifo-cache';

@Injectable()
export class TenantCacheService {
  private readonly cache = new TtlFifoCache<string, string | null>({
    maxEntries: 5_000,
    ttlMs: 300_000,
  });

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async resolve(userId: string): Promise<string | null> {
    return this.cache.resolve(userId, async (uid) => {
      const tenant = await this.tenantRepo.findOne({ where: { name: uid } });
      return tenant?.id ?? null;
    });
  }

  async ensure(userId: string): Promise<string> {
    const resolved = await this.resolve(userId);
    if (resolved) return resolved;

    const tenantId = uuidv4();
    try {
      await this.tenantRepo.insert({
        id: tenantId,
        name: userId,
        organization_name: null,
        email: null,
        is_active: true,
      });
      this.cache.set(userId, tenantId);
      return tenantId;
    } catch (error) {
      const existing = await this.tenantRepo.findOne({ where: { name: userId } });
      if (existing) {
        this.cache.set(userId, existing.id);
        return existing.id;
      }
      throw error;
    }
  }
}
