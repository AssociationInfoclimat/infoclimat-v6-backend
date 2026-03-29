import { Controller, Get } from '@nestjs/common';
import { VignettesService } from './vignettes.service';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import { User } from '../../entity-modules/user/user.types';
import { FunctionLogger } from 'src/shared/utils';
import { GetPhotoliveVignettesResponse } from './vignettes.types';
import { VignettesReponseResponseDto } from './vignettes.dto';

@Controller('')
export class VignettesController {
  private readonly logger = new FunctionLogger(VignettesController.name);
  constructor(private readonly vignettesService: VignettesService) {}

  @Get('/vignettes')
  async getVignettes(
    @UserDecorator() user: User,
  ): Promise<VignettesReponseResponseDto> {
    try {
      return VignettesReponseResponseDto.toDto(
        await this.vignettesService.getUserVignettes(user),
      );
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  @Get('/vignettes/photolive-json')
  async getPhotoLiveInformation(): Promise<
    GetPhotoliveVignettesResponse['responseData']
  > {
    try {
      return this.vignettesService.getPhotoLiveInformation();
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
