import { Module, forwardRef } from '@nestjs/common';
import { OtlpModule } from '../../otlp/otlp.module';
import { RoutingCoreModule } from '../routing-core/routing-core.module';
import { PricingCatalogModule } from '../../pricing-catalog/pricing-catalog.module';
import { ModelDiscoveryModule } from '../../model-discovery/model-discovery.module';
import { HeaderTiersModule } from '../header-tiers/header-tiers.module';
import { ResolveController } from './resolve.controller';
import { ResolveService } from './resolve.service';

@Module({
  imports: [
    OtlpModule,
    RoutingCoreModule,
    PricingCatalogModule,
    ModelDiscoveryModule,
    forwardRef(() => HeaderTiersModule),
  ],
  controllers: [ResolveController],
  providers: [ResolveService],
  exports: [ResolveService],
})
export class ResolveModule {}
