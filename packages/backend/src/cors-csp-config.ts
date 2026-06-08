// Single source of truth for the dev-mode CORS allow-list.

export interface DevOriginBuilderOptions {
  configuredOrigin: string;
}

export interface AllowedOriginBuilderOptions {
  configuredOrigin?: string;
}

export function buildDevAllowedOrigins({
  configuredOrigin,
}: DevOriginBuilderOptions): string[] {
  return buildAllowedOrigins({
    configuredOrigin,
  });
}

export function buildAllowedOrigins({
  configuredOrigin,
}: AllowedOriginBuilderOptions): string[] {
  const origins = [configuredOrigin].filter(
    (origin): origin is string => typeof origin === 'string' && origin.length > 0,
  );

  return Array.from(
    new Set(origins),
  );
}

export type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;
export type CorsOriginHandler = (origin: string | undefined, callback: CorsOriginCallback) => void;

export function createCorsOriginHandler(allowedOrigins: string[]): CorsOriginHandler {
  return (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  };
}

// Chrome's Private Network Access can block browser calls to loopback
// addresses unless the server echoes back
// `Access-Control-Allow-Private-Network: true` on the preflight. Only
// echo for origins that already passed the CORS allow-list so this
// header isn't a free pass for arbitrary callers.
//
// Shape kept narrow on purpose: takes only the request fields read and
// a setHeader callback so it composes with Express middleware and unit
// tests without dragging in `Request` / `Response` types.
export interface PnaRequest {
  method: string;
  headers: {
    origin?: string | string[];
    'access-control-request-private-network'?: string | string[];
  };
}

export function applyPrivateNetworkAllow(
  req: PnaRequest,
  allowedOrigins: string[],
  setHeader: (name: string, value: string) => void,
): void {
  if (req.method !== 'OPTIONS') return;
  const pnaHeader = req.headers['access-control-request-private-network'];
  if (pnaHeader !== 'true') return;
  const origin = req.headers.origin;
  if (typeof origin !== 'string' || !allowedOrigins.includes(origin)) return;
  setHeader('Access-Control-Allow-Private-Network', 'true');
}
