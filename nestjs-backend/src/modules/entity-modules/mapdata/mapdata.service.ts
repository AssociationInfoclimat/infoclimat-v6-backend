import { Injectable } from '@nestjs/common';
import type { Temperature } from './types';

@Injectable()
export class MapdataService {
  getTemperatures(): { temperatures: Temperature[] } {
    return {
      temperatures: [
        {
          min: 0,
          max: 10,
        },
      ],
    };
  }
}
