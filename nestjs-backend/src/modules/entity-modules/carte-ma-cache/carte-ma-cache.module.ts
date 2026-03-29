import { Module } from '@nestjs/common';
import { CarteMaCacheService } from './carte-ma-cache.service';
import { CarteMaCacheRepository } from './carte-ma-cache.repository';

@Module({
  imports: [],
  providers: [CarteMaCacheService, CarteMaCacheRepository],
  exports: [CarteMaCacheService],
})
export class CarteMaCacheModule {}
