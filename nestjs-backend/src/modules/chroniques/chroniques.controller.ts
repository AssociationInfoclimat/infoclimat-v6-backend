import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ChroniquesService } from './chroniques.service';

@Controller('chroniques')
export class ChroniquesController {
  constructor(private readonly chroniquesService: ChroniquesService) {}

  @Get('/mobile') // dont set '/bqs' or '/bim', because mobile endpoint returns both
  getMobileNews(@Query('limit') limit: number) {
    try {
      return this.chroniquesService.getMobileNews({
        limit: +limit || undefined,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/bqs')
  getChroniques(@Query('limit') limit: number) {
    try {
      return this.chroniquesService.getBqsNews({
        limit: +limit || undefined,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/bim')
  getBimNews(@Query('limit') limit: number) {
    try {
      return this.chroniquesService.getBimNews({
        limit: +limit || undefined,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/bs2s')
  getBs2s() {
    try {
      return this.chroniquesService.getBs2s();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
