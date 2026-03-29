import { Controller, Get } from '@nestjs/common';
import { PhotoLiveService } from './photolive.service';
import { FunctionLogger } from 'src/shared/utils';
import { GetLastElevenPhotoliveDto } from './photolive.dto';

@Controller('')
export class PhotoLiveController {
  private readonly logger = new FunctionLogger(PhotoLiveController.name);
  constructor(private readonly photoLiveService: PhotoLiveService) {}

  @Get('/photolive/latest')
  async getLastElevenPhotolive(): Promise<GetLastElevenPhotoliveDto[]> {
    try {
      return (await this.photoLiveService.getLastElevenPhotolive()).map(
        (photo) => GetLastElevenPhotoliveDto.toDto(photo),
      );
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
