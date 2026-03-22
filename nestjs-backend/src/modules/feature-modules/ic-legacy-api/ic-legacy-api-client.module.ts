import { Module } from '@nestjs/common';
import { IcLegacyApiClientService } from './ic-legacy-api-client.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: `${configService.get('IC_LEGACY_API_URL')}`,
        };
      },
    }),
  ],
  providers: [IcLegacyApiClientService],
  exports: [IcLegacyApiClientService],
})
export class IcLegacyApiClientModule {}
