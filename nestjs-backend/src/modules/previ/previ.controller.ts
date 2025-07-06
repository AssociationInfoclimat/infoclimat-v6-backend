import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PreviService } from './previ.service';
import {
  PostComingDaysForecastPayload,
  PostComingDaysTicketPayload,
} from './previ.dto';
import { FunctionLogger } from 'src/shared/utils';

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
}
