import { Module } from '@nestjs/common';
import { PhotoLiveRepository } from './photolive.repository';
import { PhotoLiveService } from './photolive.service';

@Module({
  providers: [PhotoLiveService, PhotoLiveRepository],
  exports: [PhotoLiveService],
})
export class PhotoLiveModule {}
