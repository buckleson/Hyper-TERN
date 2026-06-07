import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingCatalogCacheService } from './pricing-catalog-cache.service';
import { PricingSyncService } from '../database/pricing-sync.service';
import { ModelsDevSyncService } from '../database/models-dev-sync.service';
import { ProviderModelRegistryService } from '../model-discovery/provider-model-registry.service';
import { UserProvider } from '../entities/user-provider.entity';
import { CustomProvider } from '../entities/custom-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider, CustomProvider])],
  providers: [
    PricingCatalogCacheService,
    PricingSyncService,
    ModelsDevSyncService,
    ProviderModelRegistryService,
  ],
  exports: [
    PricingCatalogCacheService,
    PricingSyncService,
    ModelsDevSyncService,
    ProviderModelRegistryService,
  ],
})
export class PricingCatalogModule {}
