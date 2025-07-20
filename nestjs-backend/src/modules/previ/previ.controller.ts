import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PreviService } from './previ.service';
import {
  GetCommonRegionsDeptsResponse,
  PostComingDaysForecastPayload,
  PostComingDaysTicketPayload,
} from './previ.dto';
import { FunctionLogger, toSnakeCase } from 'src/shared/utils';

//
// This controller
//  basically fetch the data from IC legacy (/previ/.../ticket and /previ/.../get?...)
//
// We would have to update the previ.service to make it work directly in nestjs
//
@Controller('/previ')
export class PreviController {
  private readonly logger = new FunctionLogger(PreviController.name);
  constructor(private readonly previService: PreviService) {}

  @Post('ticket')
  async postTicket(@Body() body: PostComingDaysTicketPayload) {
    try {
      return await this.previService.getTicket(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Post('coming-days')
  async postComingDaysForecast(@Body() body: PostComingDaysForecastPayload) {
    try {
      return await this.previService.getForecast({
        data: body.ticket_data,
        entropy: body.entropy,
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Get('common-regions-depts')
  async getCommonRegionsDepts(): Promise<
    GetCommonRegionsDeptsResponse['responseData']
  > {
    try {
      // We already automatically convert into snake_case in the interceptor
      //  but this is not clear because we can't know the type of the response
      //  from the controller, So we should always explicitly convert it to snake_case:
      return toSnakeCase(await this.previService.getCommonRegionsDepts());
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
