import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FALLBACK_FREE_MODELS_DATA } from './free-models-fallback';

export interface GitHubModel {
  id: string | null;
  name: string;
  context: string;
  maxOutput: string;
  modality: string;
  rateLimit: string;
}

export interface GitHubProvider {
  name: string;
  category: string;
  country: string;
  flag: string;
  url: string;
  baseUrl: string | null;
  description: string;
  footnoteRef: number | null;
  models: GitHubModel[];
}

export interface GitHubDataJson {
  lastUpdated: string;
  providers: GitHubProvider[];
  [key: string]: unknown;
}

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/mnfst/awesome-free-llm-apis/main/data.json';
const FETCH_TIMEOUT_MS = 10000;

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isOptionalHttpsUrl(value: unknown): value is string | null {
  return value === null || value === undefined || isHttpsUrl(value);
}

function isValidProvider(p: unknown): p is GitHubProvider {
  if (!p || typeof p !== 'object') return false;
  const v = p as Record<string, unknown>;
  if (typeof v.name !== 'string' || v.name.length === 0) return false;
  if (typeof v.category !== 'string') return false;
  if (typeof v.country !== 'string') return false;
  if (typeof v.flag !== 'string') return false;
  if (!isHttpsUrl(v.url)) return false;
  if (!isOptionalHttpsUrl(v.baseUrl)) return false;
  if (typeof v.description !== 'string') return false;
  if (!Array.isArray(v.models)) return false;
  return v.models.every(
    (m) => m && typeof m === 'object' && typeof (m as { name?: unknown }).name === 'string',
  );
}

@Injectable()
export class FreeModelsSyncService implements OnModuleInit {
  private readonly logger = new Logger(FreeModelsSyncService.name);
  private cache: GitHubProvider[] = [...FALLBACK_FREE_MODELS_DATA.providers];
  private lastFetchedAt: Date | null = new Date(FALLBACK_FREE_MODELS_DATA.lastUpdated);

  onModuleInit(): void {
    // Fire-and-forget so a slow GitHub fetch can't delay app.listen() and trip
    // Railway's healthcheck (see #1894). Nothing reads this cache during boot;
    // the free-models endpoints tolerate an empty cache until the fetch lands.
    void this.refreshCache().catch((err) => {
      this.logger.error(`Startup free models sync failed: ${err}`);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshCache(): Promise<number> {
    this.logger.log('Refreshing free models cache from GitHub...');
    const data = await this.fetchData();
    if (!data) return 0;

    const validated = data.providers.filter((p) => {
      if (!isValidProvider(p)) {
        this.logger.warn(
          `Dropping free-models provider with invalid shape: ${
            (p as { name?: unknown })?.name ?? '<unnamed>'
          }`,
        );
        return false;
      }
      return true;
    });

    this.cache = validated;
    this.lastFetchedAt = new Date();
    this.logger.log(`Free models cache loaded: ${validated.length} providers`);
    return validated.length;
  }

  getAll(): readonly GitHubProvider[] {
    return this.cache;
  }

  getLastFetchedAt(): Date | null {
    return this.lastFetchedAt;
  }

  private async fetchData(): Promise<GitHubDataJson | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(GITHUB_RAW_URL, { signal: controller.signal });
      if (!res.ok) {
        this.logger.error(
          `GitHub raw returned ${res.status}; keeping bundled free-provider catalog`,
        );
        return null;
      }
      const body = (await res.json()) as GitHubDataJson;
      if (!Array.isArray(body.providers)) {
        this.logger.error('GitHub data.json missing providers array');
        return null;
      }
      return body;
    } catch (err) {
      this.logger.error(`Failed to fetch free models data; keeping bundled catalog: ${err}`);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}
