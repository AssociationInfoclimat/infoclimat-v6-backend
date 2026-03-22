import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IcLegacyRootApiClientService {
  private readonly logger = new FunctionLogger(
    IcLegacyRootApiClientService.name,
  );
  constructor(private readonly icHttpService: HttpService) {}

  // Under "/include":
  async fetchIncludePathFile({ path }: { path: string }): Promise<string> {
    const response = await firstValueFrom(
      this.icHttpService.get<string>(`/include${path}`, {
        responseType: 'text',
      }),
    );
    return response.data;
  }

  // Under "/photolive":
  async fetchPhotolivePathFile({ path }: { path: string }): Promise<string> {
    const response = await firstValueFrom(
      this.icHttpService.get<string>(`/photolive${path}`, {
        responseType: 'text',
      }),
    );
    return response.data;
  }
}
