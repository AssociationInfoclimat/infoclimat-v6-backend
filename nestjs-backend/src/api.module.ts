import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PreviAggregateController } from './modules/feature-modules/previ-aggregate/previ-aggregate.controller';
import { PreviAggregateModule } from './modules/feature-modules/previ-aggregate/previ-aggregate.module';
import { UserAuthMiddleware } from './middlewares/user-auth.middleware';
import { UserModule } from './modules/entity-modules/user/user.module';
import { AuthModule } from './modules/feature-modules/auth/auth.module';
import { AuthController } from './modules/feature-modules/auth/auth.controller';
import { VignettesController } from './modules/feature-modules/vignettes/vignettes.controller';
import { VignettesModule } from './modules/feature-modules/vignettes/vignettes.module';
import { PhotoLiveController } from './modules/entity-modules/photolive/photolive.controller';
import { PhotoLiveModule } from './modules/entity-modules/photolive/photolive.module';
import { CachedStatsController } from './modules/feature-modules/cached-stats/cached-stats.controller';
import { CachedStatsModule } from './modules/feature-modules/cached-stats/cached-stats.module';
import { ChroniquesModule } from './modules/entity-modules/chroniques/chroniques.modules';
import { ChroniquesController } from './modules/entity-modules/chroniques/chroniques.controller';
import { HomepageMapDataModule } from './modules/feature-modules/homepage-map-data/homepage-map-data.module';
import { HomepageMapDataController } from './modules/feature-modules/homepage-map-data/homepage-map-data.controller';
import { CachedDicoModule } from './modules/feature-modules/cached-dico/cached-dico.module';
import { CachedDicoController } from './modules/feature-modules/cached-dico/cached-dico.controller';

@Module({
  imports: [
    ConfigModule,
    // Dont import these one for now.
    //PrismaModule,
    //MapdataModule,
    //StationsMeteoModule,
    PreviAggregateModule,
    UserModule,
    AuthModule,
    CachedDicoModule,
    VignettesModule,
    PhotoLiveModule,
    ChroniquesModule,
    CachedStatsModule,
    HomepageMapDataModule,
  ],
  //
  // We explicitely import the controllers here. We want our services to expose controllers.
  // /!\ Dont forget to inject the module above, before injecting the controller below:
  //
  controllers: [
    PreviAggregateController,
    AuthController,
    CachedDicoController,
    VignettesController,
    PhotoLiveController,
    ChroniquesController,
    CachedStatsController,
    HomepageMapDataController,
  ],
  providers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserAuthMiddleware).forRoutes('*');
  }
}
