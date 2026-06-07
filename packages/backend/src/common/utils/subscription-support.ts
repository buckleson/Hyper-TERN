import type { AuthType } from 'hyper-tern-shared';
import { supportsSubscriptionProvider } from 'hyper-tern-shared';

type ProviderAuthRecord = {
  provider: string;
  auth_type?: AuthType | null;
};

export function isSupportedSubscriptionProvider(provider: string): boolean {
  return supportsSubscriptionProvider(provider);
}

export function isHyperTernUsableProvider(record: ProviderAuthRecord): boolean {
  return record.auth_type !== 'subscription' || isSupportedSubscriptionProvider(record.provider);
}
