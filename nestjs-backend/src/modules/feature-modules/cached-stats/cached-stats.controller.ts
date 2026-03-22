import { BadRequestException, Controller, Get } from '@nestjs/common';
import { CachedStatsService } from './cached-stats.service';
import { toSnakeCase } from 'src/shared/utils';
import { LiveCountersDto } from './cached-stats.dto';

@Controller('')
export class CachedStatsController {
  constructor(private readonly cachedStatsService: CachedStatsService) {}

  @Get('/stats/counters')
  async getLiveCounters(): Promise<LiveCountersDto> {
    try {
      // As mentioned somewhere else about "toSnakeCase", our controllers pass through
      //  a global interceptor so we snakify response (`api.useGlobalInterceptors(new SnakeCaseInterceptor())`)
      //  but it's not explicit so appreciate to explicitely write "toSnakeCase" even if it's useless:
      return toSnakeCase(
        LiveCountersDto.toDto(
          (await this.cachedStatsService.getLiveCounters()).liveCounters,
        ),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
