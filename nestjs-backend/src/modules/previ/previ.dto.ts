import { IsNotEmpty, IsOptional } from 'class-validator';

export class PostComingDaysTicketPayload {
  @IsOptional()
  lat?: number;

  @IsOptional()
  lon?: number;

  @IsOptional()
  accuracy?: number;
}

export class PostComingDaysForecastPayload {
  @IsNotEmpty()
  ticket_data!: string;

  @IsNotEmpty()
  entropy!: string;
}

export type GetCommonRegionsDeptsResponse = {
  responseData: {
    id: number;
    slug: string;
    label: string;
    updated_at: string;
    url: string;
  }[];
};
