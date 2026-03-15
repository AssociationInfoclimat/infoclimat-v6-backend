import { Controller, Get } from '@nestjs/common';
import { PhotoLiveService } from './photolive.service';
import { FunctionLogger, toSnakeCase } from 'src/shared/utils';

@Controller('')
export class PhotoLiveController {
  private readonly logger = new FunctionLogger(PhotoLiveController.name);
  constructor(private readonly photoLiveService: PhotoLiveService) {}

  @Get('/photolive/latest')
  async getLastElevenPhotolive() {
    try {
      // See previ controller about `toSnakeCase`
      return toSnakeCase(await this.photoLiveService.getLastElevenPhotolive());
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
