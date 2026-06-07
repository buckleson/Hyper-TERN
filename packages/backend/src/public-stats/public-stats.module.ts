import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentMessage } from '../entities/agent-message.entity';
import { PricingCatalogModule } from '../pricing-catalog/pricing-catalog.module';
import { FreeModelsModule } from '../free-models/free-models.module';
import { PublicStatsController } from './public-stats.controller';
import { PublicStatsService } from './public-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentMessage, Agent]), PricingCatalogModule, FreeModelsModule],
  controllers: [PublicStatsController],
  providers: [PublicStatsService],
})
export class PublicStatsModule {}
