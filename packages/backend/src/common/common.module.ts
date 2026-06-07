import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Agent } from '../entities/agent.entity';
import { IngestEventBusService } from './services/ingest-event-bus.service';
import { HyperTernRuntimeService } from './services/hyper-tern-runtime.service';
import { TenantCacheService } from './services/tenant-cache.service';
import { AgentRecordingCacheService } from './services/agent-recording-cache.service';
import { UserCacheInterceptor } from './interceptors/user-cache.interceptor';
import { AgentCacheInterceptor } from './interceptors/agent-cache.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Agent])],
  providers: [
    IngestEventBusService,
    HyperTernRuntimeService,
    TenantCacheService,
    AgentRecordingCacheService,
    UserCacheInterceptor,
    AgentCacheInterceptor,
  ],
  exports: [
    IngestEventBusService,
    HyperTernRuntimeService,
    TenantCacheService,
    AgentRecordingCacheService,
    UserCacheInterceptor,
    AgentCacheInterceptor,
  ],
})
export class CommonModule {}
