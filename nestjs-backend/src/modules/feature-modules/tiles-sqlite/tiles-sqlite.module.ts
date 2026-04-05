import { Module } from '@nestjs/common';
import { TilesSqliteService } from './tiles-sqlite.service';

@Module({
  providers: [TilesSqliteService],
  exports: [TilesSqliteService],
})
export class TilesSqliteModule {}
