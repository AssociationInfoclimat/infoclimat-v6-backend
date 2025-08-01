import { BadRequestException, Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { toSnakeCase } from 'src/shared/utils';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/counters')
  async getLiveCounters() {
    try {
      // As mentioned somewhere else about "toSnakeCase", our controllers pass through 
      //  a global interceptor so we snakify response (`api.useGlobalInterceptors(new SnakeCaseInterceptor())`)
      //  but it's not explicit so appreciate to explicitely write "toSnakeCase" even if it's useless:
      return toSnakeCase(
        (await this.statsService.getLiveCounters()).liveCounters,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
