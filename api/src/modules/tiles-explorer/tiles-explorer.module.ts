import { Module } from '@nestjs/common';
import { TilesExplorerService } from './tiles-explorer.service';

@Module({
  imports: [],
  providers: [TilesExplorerService],
  exports: [TilesExplorerService],
})
export class TilesExplorerModule {}
