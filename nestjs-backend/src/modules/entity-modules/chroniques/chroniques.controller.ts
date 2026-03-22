import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ChroniquesService } from './chroniques.service';
import {
  GetBimNewsDto,
  GetBqsNewsDto,
  GetBs2sDto,
  GetMobileNewsDto,
} from './chroniques.dto';

@Controller('')
export class ChroniquesController {
  constructor(private readonly chroniquesService: ChroniquesService) {}

  @Get('/chroniques/mobile') // dont set '/bqs' or '/bim', because mobile endpoint returns both
  async getMobileNews(
    @Query('limit') limit: number,
  ): Promise<GetMobileNewsDto[]> {
    try {
      const news = await this.chroniquesService.getMobileNews({
        limit: +limit || undefined,
      });
      return news.map((news) => GetMobileNewsDto.toDto(news));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/chroniques/bqs')
  async getChroniques(@Query('limit') limit: number): Promise<GetBqsNewsDto[]> {
    try {
      const news = await this.chroniquesService.getBqsNews({
        limit: +limit || undefined,
      });
      return news.map((news) => GetBqsNewsDto.toDto(news));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/chroniques/bim')
  async getBimNews(@Query('limit') limit: number): Promise<GetBimNewsDto[]> {
    try {
      const news = await this.chroniquesService.getBimNews({
        limit: +limit || undefined,
      });
      return news.map((news) => GetBimNewsDto.toDto(news));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/chroniques/bs2s')
  async getBs2s(): Promise<GetBs2sDto[]> {
    try {
      const bs2s = await this.chroniquesService.getBs2s();
      return bs2s.map((bs2s) => GetBs2sDto.toDto(bs2s));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
