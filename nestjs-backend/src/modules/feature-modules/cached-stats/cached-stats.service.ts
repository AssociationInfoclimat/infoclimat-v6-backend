import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { RedisCacheManagerService } from '../redis-cache-manager/redis-cache-manager.service';
import * as fs from 'fs';
import { FunctionLogger } from 'src/shared/utils';
import { LiveCounters } from './cached-stats.types';
import { StatsService } from 'src/modules/entity-modules/stats/stats.service';

@Injectable()
export class CachedStatsService {
  private readonly logger = new FunctionLogger(CachedStatsService.name);
  constructor(
    private readonly statsService: StatsService,
    private readonly configService: ConfigService,
    private readonly cacheService: RedisCacheManagerService,
  ) {}

  async getLiveCounters(): Promise<{
    liveCounters: LiveCounters;
  }> {
    // Fetch counter for IC website:
    const cacheKey = 'stats:loggedin-number';
    let nbWebsiteConnected: number;
    const cacheExists = await this.cacheService.getItem<number>(cacheKey);
    if (cacheExists) {
      nbWebsiteConnected = cacheExists;
    } else {
      nbWebsiteConnected = await this.statsService.getLiveCounters();
      await this.cacheService.setItem<number>(
        cacheKey,
        nbWebsiteConnected,
        5 * 60,
      );
    }

    // Fetch counters from other apps:
    let nbForumsConnected: number;
    let nbApplisConnected: number;
    try {
      nbForumsConnected = +fs.readFileSync(
        `${this.configService.get('PATH_TO_APP_LIVE_USER_COUNTERS')}/forum.txt`,
        'utf8',
      );
    } catch (error) {
      this.logger.error(`Error getting nbForumsConnected: ${error}`);
      nbForumsConnected = 0;
    }
    try {
      nbApplisConnected = +fs.readFileSync(
        `${this.configService.get('PATH_TO_APP_LIVE_USER_COUNTERS')}/appli.txt`,
        'utf8',
      );
    } catch (error) {
      this.logger.error(`Error getting nbApplisConnected: ${error}`);
      nbApplisConnected = 0;
    }
    return {
      liveCounters: {
        loggedinUsers: nbWebsiteConnected,
        forumUsers: nbForumsConnected,
        appUsers: nbApplisConnected,
      },
    };
  }
}
