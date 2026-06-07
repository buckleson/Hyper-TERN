import { readFileSync } from 'fs';
import { resolve } from 'path';

export const DEFAULT_TELEMETRY_ENDPOINT = 'https://telemetry.hyper-tern.build/v1/report';
export const TELEMETRY_SCHEMA_VERSION = 1;
export const TELEMETRY_DOCS_URL = 'https://hyper-tern.build/docs/self-hosted#telemetry';

export interface TelemetryConfig {
  enabled: boolean;
  endpoint: string;
  hyperTernVersion: string;
}

/**
 * Opt-out with `HYPER_TERN_TELEMETRY_DISABLED=1`. Also auto-silenced outside
 * production so dev instances and test runs never report. Also silenced
 * when the Hyper-Tern version can't be read — the ingest validates
 * `hyper_tern_version` as semver, so a misconfigured image without
 * `packages/hyper-tern/package.json` would otherwise spam the endpoint
 * with 400s.
 */
export function buildTelemetryConfig(env: NodeJS.ProcessEnv = process.env): TelemetryConfig {
  const disabled = env['HYPER_TERN_TELEMETRY_DISABLED'];
  const isProd = (env['NODE_ENV'] ?? 'development') === 'production';
  const isDisabled = disabled === '1' || disabled === 'true';
  const hyperTernVersion = readHyperTernVersion();
  const versionReadable = hyperTernVersion !== UNKNOWN_VERSION;
  return {
    enabled: isProd && !isDisabled && versionReadable,
    endpoint: env['TELEMETRY_ENDPOINT'] ?? DEFAULT_TELEMETRY_ENDPOINT,
    hyperTernVersion,
  };
}

export const UNKNOWN_VERSION = 'unknown';

export function readHyperTernVersion(): string {
  try {
    const path = resolve(__dirname, '../../../hyper-tern/package.json');
    const raw = readFileSync(path, 'utf8');
    const pkg = JSON.parse(raw) as { version?: unknown };
    if (typeof pkg.version === 'string') return pkg.version;
    return UNKNOWN_VERSION;
  } catch {
    return UNKNOWN_VERSION;
  }
}
