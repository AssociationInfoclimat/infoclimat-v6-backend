import { Controller, Get } from '@nestjs/common';
import { VignettesService } from './vignettes.service';
import { Auth } from 'src/decorators/auth.decorator';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import { User } from '../user/user.types';
import { FunctionLogger } from 'src/shared/utils';

@Controller('vignettes')
export class VignettesController {
  private readonly logger = new FunctionLogger(VignettesController.name);
  constructor(private readonly vignettesService: VignettesService) {}

  @Get()
  @Auth()
  async getVignettes(@UserDecorator() user: User) {
    try {
      return this.vignettesService.getUserVignettes(user);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
