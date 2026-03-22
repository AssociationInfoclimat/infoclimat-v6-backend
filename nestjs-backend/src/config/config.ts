// We gonna use this instead of configService
//  because it's easier to use and we actually just need things from .env file.

import dotenv, { type DotenvParseOutput } from 'dotenv';
import z from 'zod';
import { existsSync, readFileSync } from 'fs';
import { FunctionLogger } from 'src/shared/utils';

const envSchema = z.object({
  HOST: z.string(),

  STATIONS_METEO_PATTERN_TILES_KEY: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
const logger = new FunctionLogger('CONFIG');

const rawEnvConfig = ((): Record<string, unknown> => {
  if (existsSync('./.env') && !process.env.NODE_ENV) {
    dotenv.config({ path: './.env' });
  }

  let envVars: Record<string, string | undefined | boolean> = {};
  try {
    const fileConfig: DotenvParseOutput = dotenv.parse(readFileSync('./.env'));
    envVars = Object.assign({}, fileConfig, process.env);
  } catch {
    envVars = process.env;
  }
  // At that point 'true' and 'false' in vars are not boolean but just strings.
  // Same thing for numbers, they are just strings.
  //
  //  So let's convert them:
  Object.keys(envVars).forEach((key) => {
    if (envVars[key] === 'true') {
      envVars[key] = true;
    } else if (envVars[key] === 'false') {
      envVars[key] = false;
    }
  });

  return envVars;
})();

let envConfig: EnvConfig;

try {
  envConfig = envSchema.parse(rawEnvConfig);
  logger.log('Environment variables validated successfully');
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error('Environment validation failed:');
    error.issues.map((issue) => {
      logger.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    logger.error('Invalid environment configuration');
  }
  throw error;
}

// Reused config values:

const isStagingOrDev: boolean =
  !envConfig.HOST ||
  (!!envConfig.HOST &&
    (envConfig.HOST.indexOf('staging') > -1 ||
      envConfig.HOST.indexOf('localhost') > -1 ||
      envConfig.HOST.indexOf('127.0.0.1') > -1));

// Final config object:

const config = {
  ...envConfig,
  // Add below the getters:
  isStagingOrDev,
};

export { config };
