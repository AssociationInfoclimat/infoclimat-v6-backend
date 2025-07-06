import { Module } from '@nestjs/common';
import { MapdataModule } from './modules/mapdata/mapdata.module';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from './config/config.module';
import { StationsMeteoModule } from './modules/stations-meteo/stations-meteo.module';
import { PreviController } from './modules/previ/previ.controller';
import { PreviModule } from './modules/previ/previ.module';

@Module({
  imports: [
    ConfigModule,
    // Dont import these one for now.
    //PrismaModule,
    //MapdataModule,
    //StationsMeteoModule,
    PreviModule,
  ],
  controllers: [PreviController], // We explicitely import the controllers here. We want our services to expose controllers.
  providers: [],
})
export class ApiModule {}
