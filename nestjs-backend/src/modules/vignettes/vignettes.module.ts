import { Module } from '@nestjs/common';
import { VignettesService } from './vignettes.service';
import { IcLegacyIncludeApiClientModule } from '../ic-legacy-include-api/ic-legacy-include-api-client.module';

@Module({
  imports: [IcLegacyIncludeApiClientModule],
  providers: [VignettesService],
  exports: [VignettesService],
})
export class VignettesModule {}
