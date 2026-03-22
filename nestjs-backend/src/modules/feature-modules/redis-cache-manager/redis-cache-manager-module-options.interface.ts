export interface RedisCacheManagerModuleOptions {
  redisHostUrl: string;
  redisPort: string;
  redisPasword?: string;
  cachePrefix?: string;
  defaultTtl?: number; // in seconds
}
