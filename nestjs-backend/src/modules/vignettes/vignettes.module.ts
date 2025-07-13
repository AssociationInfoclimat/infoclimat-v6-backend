import { Module } from '@nestjs/common';
import { VignettesService } from './vignettes.service';
import { IcLegacyRootApiClientModule } from '../ic-legacy-root-api/ic-legacy-root-api-client.module';

@Module({
  imports: [IcLegacyRootApiClientModule],
  providers: [VignettesService],
  exports: [VignettesService],
})
export class VignettesModule {}
