import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SnakeCaseInterceptor } from './shared/interceptors/snake-case.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { isStagingEnv } from './shared/utils';

let server: { close: (arg0: (err: any) => void) => void };

const shutdown = () => {
  // Gracefully close outstanding HTTP connections
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
};

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  api.setGlobalPrefix('api');
  api.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  api.useGlobalFilters(new HttpExceptionFilter());
  api.useGlobalInterceptors(new SnakeCaseInterceptor());

  isStagingEnv()
    ? api.enableCors({
        origin: true,
        credentials: true,
      })
    : api.enableCors();

  server = await api.listen(3000);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  process.on('unhandledRejection', (err: Error) => {
    const logger = new Logger('unhandledRejection');
    logger.error(`[FATAL][unhandledRejection] ${err} : ${err.stack as string}`);
  });
}
bootstrap();
