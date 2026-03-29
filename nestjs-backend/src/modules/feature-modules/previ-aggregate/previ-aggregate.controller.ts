import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PreviAggregateService } from './previ-aggregate.service';
import {
  GetCommonRegionsDeptsResponseDto,
  PostComingDaysForecastPayload,
  PostComingDaysTicketPayload,
} from './previ-aggregate.dto';
import { FunctionLogger } from 'src/shared/utils';
import {
  GetOpenDataApiForecastResponse,
  GetOpenDataApiTicketResponse,
} from '../ic-legacy-api/ic-legacy-api-client.types';

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
  async postTicket(
    @Body() body: PostComingDaysTicketPayload,
  ): Promise<GetOpenDataApiTicketResponse['responseData']> {
    try {
      return await this.previAggregateService.getTicket(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Post('/previ/coming-days')
  async postComingDaysForecast(
    @Body() body: PostComingDaysForecastPayload,
  ): Promise<GetOpenDataApiForecastResponse['reponseData']> {
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
  async getCommonRegionsDepts(): Promise<GetCommonRegionsDeptsResponseDto> {
    try {
      return GetCommonRegionsDeptsResponseDto.toDto(
        await this.previAggregateService.getCommonRegionsDepts(),
      );
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
