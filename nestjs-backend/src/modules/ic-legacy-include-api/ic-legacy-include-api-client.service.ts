import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IcLegacyIncludeApiClientService {
  private readonly logger = new FunctionLogger(
    IcLegacyIncludeApiClientService.name,
  );
  constructor(private readonly icHttpService: HttpService) {}

  // Under "/include":
  async fetchIncludePathFile({ path }: { path: string }) {
    try {
      const response = await firstValueFrom(
        this.icHttpService.get<string>(`${path}`, {
          responseType: 'text',
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
