import { Injectable, Module } from '@nestjs/common';
import { FunctionLogger } from '../../../shared/utils';
import { ConfigModule } from 'src/config/config.module';
import { ScheduleModule, Cron, Timeout } from '@nestjs/schedule';
import { SynopDataModule } from 'src/modules/stations/synop/synop-data.module';
import { MetarDataModule } from 'src/modules/stations/metar/metar-data.module';
import { StationsModule } from 'src/modules/stations/stations.module';
import { SynopDataService } from 'src/modules/stations/synop/synop-data.service';
import { MetarDataService } from 'src/modules/stations/metar/metar-data.service';
import { StationsService } from 'src/modules/stations/stations.service';
import { StationGenre } from 'src/modules/stations/stations.types';
import { MetsynService } from 'src/modules/stations/metsyn/metsyn.service';
import { MetsynModule } from 'src/modules/stations/metsyn/metsyn.module';

@Injectable()
class RefreshStationsVignettesCronService {
  private readonly logger = new FunctionLogger(
    RefreshStationsVignettesCronService.name,
  );
  constructor(
    private readonly stationsService: StationsService,
    private readonly synopDataService: SynopDataService,
    private readonly metarDataService: MetarDataService,
    private readonly metsynService: MetsynService,
  ) {}

  @Timeout(2)
  // @Cron('*/15 * * * *')
  async scheduledRefreshStationsVignettes() {
    try {
      this.logger.log('Scheduled refresh stations vignettes started');

      //
      // See vignettes.php
      //
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = now.getMonth() + 1;
      const dd = now.getDate();

      const stations = await this.stationsService.getCommonStations();
      for (const station of stations) {
        if (station.kind === StationGenre.METAR) {
          const metarData = await this.metarDataService.getMetarData({
            stationId: station.id,
            yyyy,
            mm,
            dd,
          });
        } else if (station.kind === StationGenre.SYNOP) {
          const synopData = await this.synopDataService.getSynopData({
            stationId: station.id,
            yyyy,
            mm,
            dd,
          });
        }
      }

      //
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    StationsModule,
    MetarDataModule,
    SynopDataModule,
    MetsynModule,
  ],
  providers: [RefreshStationsVignettesCronService],
})
export class RefreshStationsVignettesCronModule {}
