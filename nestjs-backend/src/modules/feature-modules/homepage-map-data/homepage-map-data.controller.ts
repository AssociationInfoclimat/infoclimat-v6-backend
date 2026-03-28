import { FunctionLogger, md5 } from 'src/shared/utils';
import { HomepageMapDataService } from './homepage-map-data.service';
import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { HomepageMapDataDto } from './homepage-map-data.dto';
import { Request } from 'express';

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

  /*
    $user_token = md5("{$_SERVER['REMOTE_ADDR']}dynamicmap{$_SERVER['HTTP_USER_AGENT']}");
  */
  @Get('/homepage-map-token')
  getHomepageMapToken(
    @Req() req: Request, // Could be ICRequest but we don't need the user
  ): string {
    if (!req.ip || !req.headers['user-agent']) {
      throw new BadRequestException('errors.invalid_request');
    }
    return md5(`${req.ip}dynamicmap${req.headers['user-agent']}`);
  }
}
