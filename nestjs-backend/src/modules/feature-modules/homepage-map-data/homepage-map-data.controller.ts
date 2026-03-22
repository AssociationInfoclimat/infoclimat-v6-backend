import { FunctionLogger } from 'src/shared/utils';
import { HomepageMapDataService } from './homepage-map-data.service';
import { Controller, Get } from '@nestjs/common';
import { HomepageMapDataDto } from './homepage-map-data.dto';

@Controller('')
export class HomepageMapDataController {
  private readonly logger = new FunctionLogger(HomepageMapDataController.name);
  constructor(
    private readonly homepageMapDataService: HomepageMapDataService,
  ) {}

  @Get('/homepage-map-data')
  async getHomepageMapData(): Promise<HomepageMapDataDto> {
    return HomepageMapDataDto.toDto(
      await this.homepageMapDataService.getAndPersistHomepageMapData(),
    );
  }
}
