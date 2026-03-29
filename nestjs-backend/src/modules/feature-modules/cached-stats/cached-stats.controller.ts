import { BadRequestException, Controller, Get } from '@nestjs/common';
import { CachedStatsService } from './cached-stats.service';
import { LiveCountersDto } from './cached-stats.dto';

@Controller('')
export class CachedStatsController {
  constructor(private readonly cachedStatsService: CachedStatsService) {}

  @Get('/stats/counters')
  async getLiveCounters(): Promise<LiveCountersDto> {
    try {
      return LiveCountersDto.toDto(
        (await this.cachedStatsService.getLiveCounters()).liveCounters,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
