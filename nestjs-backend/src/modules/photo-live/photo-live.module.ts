import { Module } from '@nestjs/common';
import { PhotoLiveRepository } from './photo-live.repository';
import { PhotoLiveService } from './photo-live.service';

@Module({
  providers: [PhotoLiveService, PhotoLiveRepository],
  exports: [PhotoLiveService],
})
export class PhotoLiveModule {}
