import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MapdataModule } from './modules/mapdata/mapdata.module';
import { ConfigModule } from './config/config.module';
import { StationsMeteoModule } from './modules/stations-meteo/stations-meteo.module';
import { PreviController } from './modules/previ/previ.controller';
import { PreviModule } from './modules/previ/previ.module';
import { UserAuthMiddleware } from './middlewares/user-auth.middleware';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { DicoController } from './modules/dico/dico.controller';
import { DicoModule } from './modules/dico/dico.module';
import { VignettesController } from './modules/vignettes/vignettes.controller';
import { VignettesModule } from './modules/vignettes/vignettes.module';

@Module({
  imports: [
    ConfigModule,
    // Dont import these one for now.
    //PrismaModule,
    //MapdataModule,
    //StationsMeteoModule,
    PreviModule,
    UserModule,
    AuthModule,
    DicoModule,
    VignettesModule,
  ],
  //
  // We explicitely import the controllers here. We want our services to expose controllers.
  // /!\ Dont forget to inject the module above, before injecting the controller below:
  //
  controllers: [
    PreviController,
    UserController,
    AuthController,
    DicoController,
    VignettesController,
  ],
  providers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes('*');
  }
}
