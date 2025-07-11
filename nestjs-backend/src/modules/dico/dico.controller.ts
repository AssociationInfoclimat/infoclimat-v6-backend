import { BadRequestException, Controller, Get } from '@nestjs/common';
import { DicoService } from './dico.service';
import { FunctionLogger } from 'src/shared/utils';

@Controller('dico')
export class DicoController {
  private readonly logger = new FunctionLogger(DicoController.name);
  constructor(private readonly dicoService: DicoService) {}

  @Get('random')
  async getRandomLexique() {
    try {
      return this.dicoService.getTenRandomLexique();
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
