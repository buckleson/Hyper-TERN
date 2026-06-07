import { getModelLabel } from './provider-utils.js';
import { inferProviderFromModel, stripCustomPrefix } from './routing-utils.js';

export function preloadModelDisplayNames(): void {
  // Kept as a no-op for callers that warm display labels before rendering tables.
}

export function getModelDisplayName(slug: string): string {
  const provId = inferProviderFromModel(slug);
  if (provId) return getModelLabel(provId, slug);
  return stripCustomPrefix(slug);
}
