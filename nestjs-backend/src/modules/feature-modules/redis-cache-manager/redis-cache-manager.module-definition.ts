import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { RedisCacheManagerModuleOptions } from './redis-cache-manager-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisCacheManagerModuleOptions>().build();
