import {
  applyPrivateNetworkAllow,
  buildAllowedOrigins,
  buildDevAllowedOrigins,
  createCorsOriginHandler,
} from './cors-csp-config';

describe('buildDevAllowedOrigins', () => {
  it('allows the configured frontend origin', () => {
    expect(
      buildDevAllowedOrigins({
        configuredOrigin: 'http://localhost:3000',
      }),
    ).toEqual(['http://localhost:3000']);
  });
});

describe('buildAllowedOrigins', () => {
  it('deduplicates configured origins', () => {
    expect(
      buildAllowedOrigins({
        configuredOrigin: 'http://localhost:3000',
      }),
    ).toEqual(['http://localhost:3000']);
  });

  it('omits empty origins', () => {
    expect(buildAllowedOrigins({})).toEqual([]);
  });
});

describe('createCorsOriginHandler', () => {
  const handler = createCorsOriginHandler(['http://localhost:3000']);

  it('allows requests with no Origin header (same-origin / curl / server-to-server)', () => {
    const cb = jest.fn();
    handler(undefined, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('allows a listed origin', () => {
    const cb = jest.fn();
    handler('http://localhost:3000', cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('blocks an unlisted origin without surfacing an error', () => {
    const cb = jest.fn();
    handler('https://evil.example.com', cb);
    expect(cb).toHaveBeenCalledWith(null, false);
  });
});

describe('applyPrivateNetworkAllow', () => {
  const allowed = ['http://localhost:3000'];

  it('echoes the PNA allow header for OPTIONS preflight from a listed origin', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      {
        method: 'OPTIONS',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-private-network': 'true',
        },
      },
      allowed,
      setHeader,
    );
    expect(setHeader).toHaveBeenCalledWith('Access-Control-Allow-Private-Network', 'true');
  });

  it('does not echo for non-OPTIONS methods', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      {
        method: 'GET',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-private-network': 'true',
        },
      },
      allowed,
      setHeader,
    );
    expect(setHeader).not.toHaveBeenCalled();
  });

  it('does not echo when the PNA request header is missing', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      { method: 'OPTIONS', headers: { origin: 'http://localhost:3000' } },
      allowed,
      setHeader,
    );
    expect(setHeader).not.toHaveBeenCalled();
  });

  it('does not echo for unlisted origins', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      {
        method: 'OPTIONS',
        headers: {
          origin: 'https://evil.example.com',
          'access-control-request-private-network': 'true',
        },
      },
      allowed,
      setHeader,
    );
    expect(setHeader).not.toHaveBeenCalled();
  });

  it('does not echo when the Origin header is missing entirely', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      {
        method: 'OPTIONS',
        headers: { 'access-control-request-private-network': 'true' },
      },
      allowed,
      setHeader,
    );
    expect(setHeader).not.toHaveBeenCalled();
  });

  it('ignores duplicate-header arrays (Express normalises but Node http does not)', () => {
    const setHeader = jest.fn();
    applyPrivateNetworkAllow(
      {
        method: 'OPTIONS',
        headers: {
          origin: ['http://localhost:3000', 'http://localhost:3000'],
          'access-control-request-private-network': 'true',
        },
      },
      allowed,
      setHeader,
    );
    expect(setHeader).not.toHaveBeenCalled();
  });
});
