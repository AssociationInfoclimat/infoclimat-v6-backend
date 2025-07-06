import { Module } from '@nestjs/common';
import { PreviController } from './previ.controller';
import { PreviService } from './previ.service';
import { IcLegacyApiClientModule } from '../ic-legacy-api/ic-legacy-api-client.module';

@Module({
  imports: [IcLegacyApiClientModule],
  providers: [PreviService, PreviController],
  exports: [PreviService, PreviController],
})
export class PreviModule {}
