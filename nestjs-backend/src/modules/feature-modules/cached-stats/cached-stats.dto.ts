import { IsNumber } from 'class-validator';
import { LiveCounters } from './cached-stats.types';

export class LiveCountersDto {
  @IsNumber()
  loggedin_users: number;
  @IsNumber()
  forum_users: number;
  @IsNumber()
  app_users: number;

  static toDto(liveCounters: LiveCounters): LiveCountersDto {
    return {
      loggedin_users: liveCounters.loggedinUsers,
      forum_users: liveCounters.forumUsers,
      app_users: liveCounters.appUsers,
    };
  }
}
