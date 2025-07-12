import { type Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheManagerModuleOptions } from './redis-cache-manager-module-options.interface';
import { MODULE_OPTIONS_TOKEN } from './redis-cache-manager.module-definition';
import { FunctionLogger } from 'src/shared/utils';
import { isPromise } from 'util/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheManagerService {
  private readonly logger = new FunctionLogger(RedisCacheManagerService.name);
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly configOpts: RedisCacheManagerModuleOptions,
  ) {}

  async getOrSetItem<T>({
    key,
    data,
    ttlSeconds,
  }: {
    key: string;
    data: T | Promise<T>;
    ttlSeconds?: number;
  }) {
    if (key.length > 500) {
      // Looks like this key is something "unique" to store..
      return data;
    }
    const cacheExists = await this.getItem<T>(key);
    if (!cacheExists) {
      if (isPromise(data)) {
        await this.setItem<T>(key, await data, ttlSeconds);
      } else {
        await this.setItem<T>(key, data, ttlSeconds);
      }
      return data;
    }
    return cacheExists;
  }

  async setItem<T>(
    key: string,
    data: T,
    ttlSeconds?: number,
    throwErr?: boolean,
  ) {
    try {
      await this.cache.stores[0].set(
        `cache.${this.configOpts.cachePrefix ? `${this.configOpts.cachePrefix}.` : ''}${key}`,
        data === 0 ? '__ZERO__' : data, // If we try to store "0" as a number, it does not store it in redis!
        (ttlSeconds || this.configOpts.defaultTtl || 1) * 1000,
      );
    } catch (error) {
      this.logger.error(`${error}`);
      if (throwErr) {
        throw error;
      }
    }
  }

  async getItem<T>(key: string, throwErr?: boolean): Promise<T | undefined> {
    try {
      const data = await this.cache.stores[0].get<T>(
        `cache.${this.configOpts.cachePrefix ? `${this.configOpts.cachePrefix}.` : ''}${key}`,
      );
      if (data === '__ZERO__') {
        return 0 as T; // When it's a number that we store, T is supposed to extend Number ofc.
      }
      return data;
    } catch (error) {
      this.logger.error(`${error}`);
      if (throwErr) {
        throw error;
      }
    }
  }

  async deleteItem(key: string, throwErr?: boolean): Promise<void> {
    try {
      await this.cache.stores[0].delete(
        `cache.${this.configOpts.cachePrefix ? `${this.configOpts.cachePrefix}.` : ''}${key}`,
      );
    } catch (error) {
      this.logger.error(`${error}`);
      if (throwErr) {
        throw error;
      }
    }
  }
}
