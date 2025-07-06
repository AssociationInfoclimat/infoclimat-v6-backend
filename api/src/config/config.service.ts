import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  logger = new Logger(ConfigService.name);
  private readonly envConfig: Record<string, string | undefined>;

  constructor(filePath: string) {
    // In dev mode
    if (fs.existsSync('./.env') && !process.env.NODE_ENV) {
      dotenv.config({ path: './.env' });
    }

    try {
      this.envConfig = Object.assign(
        {},
        dotenv.parse(fs.readFileSync(filePath)),
        process.env,
      );
    } catch (_e) {
      this.logger.error(
        'No environment file found. Create one! Try to load default memory env',
      );
      this.envConfig = process.env;
    }
  }

  get(key: string): string | undefined {
    return this.envConfig[key];
  }
}
