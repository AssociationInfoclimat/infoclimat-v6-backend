import { Module } from '@nestjs/common';
import { PreviAggregateController } from './previ-aggregate.controller';
import { PreviAggregateService } from './previ-aggregate.service';
import { IcLegacyApiClientModule } from '../ic-legacy-api/ic-legacy-api-client.module';
import { PreviModule } from '../../entity-modules/previ/previ.module';

@Module({
  imports: [IcLegacyApiClientModule, PreviModule],
  providers: [PreviAggregateService, PreviAggregateController],
  exports: [PreviAggregateService, PreviAggregateController],
})
export class PreviAggregateModule {}
