import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PreviAggregateService } from './previ-aggregate.service';
import {
  GetCommonRegionsDeptsResponse,
  PostComingDaysForecastPayload,
  PostComingDaysTicketPayload,
} from './previ-aggregate.dto';
import { FunctionLogger, toSnakeCase } from 'src/shared/utils';

//
// This controller
//  basically fetch the data from IC legacy (/previ/.../ticket and /previ/.../get?...)
//
// We would have to update the previ.service to make it work directly in nestjs
//
@Controller('')
export class PreviAggregateController {
  private readonly logger = new FunctionLogger(PreviAggregateController.name);
  constructor(private readonly previAggregateService: PreviAggregateService) {}

  @Post('/previ/ticket')
  async postTicket(@Body() body: PostComingDaysTicketPayload) {
    try {
      return await this.previAggregateService.getTicket(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Post('/previ/coming-days')
  async postComingDaysForecast(@Body() body: PostComingDaysForecastPayload) {
    try {
      return await this.previAggregateService.getForecast({
        data: body.ticket_data,
        entropy: body.entropy,
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Get('/previ/common-regions-depts')
  async getCommonRegionsDepts(): Promise<
    GetCommonRegionsDeptsResponse['responseData']
  > {
    try {
      // We already automatically convert into snake_case in the interceptor
      //  but this is not clear because we can't know the type of the response
      //  from the controller, So we should always explicitly convert it to snake_case:
      return toSnakeCase(
        await this.previAggregateService.getCommonRegionsDepts(),
      );
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
