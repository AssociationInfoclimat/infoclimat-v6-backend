import type { INestApplicationContext } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cluster from 'cluster';
import { RefreshStationsVignettesCronModule } from './modules/cron/refresh-stations-vignettes/refresh-stations-vignettes.cron';

enum CronName {
  // Persist in cache the data from synop and metar tables, day by day, and station by station,
  //  in legacy was :
  // # 14,44 * * * * root wget -O /dev/null http://v5.infoclimat.fr/cron/vignettes.php 1>/dev/null 2>/dev/null  # Génération des vignettes pour la V5
  // 14,44 * * * * root wget -O /dev/null http://v5.infoclimat.fr/cron/vignettes_V4.php 1>/dev/null 2>/dev/null  # Génération des vignettes pour la V4
  REFRESH_STATIONS_VIGNETTES = 'refresh-stations-vignettes',
}

let server: undefined | INestApplicationContext = undefined;

async function bootstrapCron(module: string) {
  let cronModule;
  const logger = new Logger('Cron');

  if (process.env.module) {
    module = process.env.module;
  }
  switch (module) {
    case CronName.REFRESH_STATIONS_VIGNETTES:
      cronModule = {
        name: CronName.REFRESH_STATIONS_VIGNETTES,
        module: RefreshStationsVignettesCronModule,
      };
      break;
  }

  if (!cronModule) {
    throw new Error(`Cron module ${module} not found`);
  }

  logger.log(`Starting cron ${module}...`);

  if (!Array.isArray(cronModule)) {
    server = await NestFactory.createApplicationContext(cronModule.module);

    await server.init();

    const shutdown = async (signal: string) => {
      const logger = new Logger('shutdown');
      logger.warn(
        `Requested a shutdown.. \`server.close\` will be triggered after the app gracefully closed. ${signal}`,
      );
      // NestJS app was ready and running:
      if (server !== undefined) {
        try {
          // The below `await app.close()` aim to let
          //  the app terminates gracefully for long tasks when we docker restart the containers.
          //  (letting controller/service async function to be finished)
          // https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events-1
          await server.close();
          logger.log('App closed.');
          // await triggerAfterShutdownHooks(server);
          logger.log('Good bye!');
        } catch (err) {
          logger.error(`${err}`);
          process.exit(1);
        }
      }
      process.exit(0);
    };
    process.on('SIGTERM', shutdown);
  } else {
    if (cluster.isPrimary) {
      for (const cron of cronModule) {
        cluster.fork({
          module: cron.name,
        });
      }
    }
  }
}
if (!process.argv[2]) {
  console.log('Missing cron name in arg list, possible values: ');
  Object.values(CronName).forEach((cronName) => {
    console.log(cronName);
  });
  process.exit();
}
void bootstrapCron(process.argv[2]);
