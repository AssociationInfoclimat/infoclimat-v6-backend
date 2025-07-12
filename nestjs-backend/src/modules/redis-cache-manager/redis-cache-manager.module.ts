import { Module, DynamicModule, Global } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { RedisCacheManagerService } from './redis-cache-manager.service';
import { MODULE_OPTIONS_TOKEN } from './redis-cache-manager.module-definition';

export interface CacheManagerOptions {
  redisUsername?: string;
  redisPassword?: string;
  redisHost?: string;
  redisPort?: number;
  ttl?: number;
}

@Global()
@Module({})
export class CacheManagerModule {
  static registerAsync(options: {
    useFactory: (...args: any[]) => CacheManagerOptions;
    inject?: any[];
    imports?: any[];
  }): DynamicModule {
    const asyncOptions = {
      ...options,
      useFactory: (...args: any[]): CacheModuleOptions => {
        const config = options.useFactory(...args);
        const {
          redisUsername,
          redisPassword,
          redisHost = 'localhost',
          redisPort = 6379,
          ttl,
        } = config;

        const auth =
          redisUsername && redisPassword
            ? `${redisUsername}:${redisPassword}@`
            : '';
        const redisUrl = `redis://${auth}${redisHost}:${redisPort}`;
        const keyv = new Keyv(
          new KeyvRedis({
            url: redisUrl,
            password: undefined,
            disableOfflineQueue: true, // We dont want to try anything if queue is down. (dont want stuck/pending requests)
            socket: {
              host: redisHost,
              port: redisPort,
              reconnectStrategy: (retries) => {
                return Math.min(retries * 50, 2000);
              },
              connectTimeout: 3000,
              // keepAlive: 30000,
            },
          }),
        );

        return {
          isGlobal: true,
          ttl,
          stores: [keyv],
        };
      },
    };

    return {
      module: CacheManagerModule,
      imports: [
        CacheModule.registerAsync(asyncOptions),
        ...(options.imports || []),
      ],
      providers: [
        {
          // We need this provide to give to `RedisCacheManagerService`
          //  the options (`configOpts`) that comes from the `CacheManagerModule.registerAsync`
          provide: MODULE_OPTIONS_TOKEN,
          inject: options.inject,
          useFactory: async (...args: any[]) => {
            return options.useFactory(...args);
          },
        },
        {
          provide: RedisCacheManagerService,
          useClass: RedisCacheManagerService,
        },
      ],
      exports: [RedisCacheManagerService],
    };
  }
}
