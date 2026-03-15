import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PreviController } from './modules/previ/previ.controller';
import { PreviModule } from './modules/previ/previ.module';
import { UserAuthMiddleware } from './middlewares/user-auth.middleware';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';
import { DicoController } from './modules/dico/dico.controller';
import { DicoModule } from './modules/dico/dico.module';
import { VignettesController } from './modules/vignettes/vignettes.controller';
import { VignettesModule } from './modules/vignettes/vignettes.module';
import { PhotoLiveController } from './modules/photolive/photolive.controller';
import { PhotoLiveModule } from './modules/photolive/photolive.module';
import { ChroniquesModule } from './modules/chroniques/chroniques.modules';
import { ChroniquesController } from './modules/chroniques/chroniques.controller';
import { StatsController } from './modules/stats/stats.controller';
import { StatsModule } from './modules/stats/stats.module';

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
    PhotoLiveModule,
    ChroniquesModule,
    StatsModule,
  ],
  //
  // We explicitely import the controllers here. We want our services to expose controllers.
  // /!\ Dont forget to inject the module above, before injecting the controller below:
  //
  controllers: [
    PreviController,
    AuthController,
    DicoController,
    VignettesController,
    PhotoLiveController,
    ChroniquesController,
    StatsController,
  ],
  providers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserAuthMiddleware).forRoutes('*');
  }
}
