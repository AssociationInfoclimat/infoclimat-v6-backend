import { Module } from '@nestjs/common';
import { IcLegacyIncludeApiClientService } from './ic-legacy-include-api-client.service';
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
          baseURL: `${configService.get('IC_LEGACY_INCLUDE_API_URL')}`, // ends with "/include"
        };
      },
    }),
  ],
  providers: [IcLegacyIncludeApiClientService],
  exports: [IcLegacyIncludeApiClientService],
})
export class IcLegacyIncludeApiClientModule {}
