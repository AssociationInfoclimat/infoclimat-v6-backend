import { IsNotEmpty, IsOptional } from 'class-validator';
import { CommonRegionsDepts } from 'src/modules/entity-modules/previ/previ.types';

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

export class GetCommonRegionsDeptsResponseDto {
  items: {
    id: number;
    slug: string;
    label: string;
    updated_at: string;
    url: string;
  }[];

  static toDto(
    commonRegionsDepts: CommonRegionsDepts[],
  ): GetCommonRegionsDeptsResponseDto {
    return {
      items: commonRegionsDepts.map((commonRegionsDept) => ({
        id: commonRegionsDept.id,
        slug: commonRegionsDept.slug,
        label: commonRegionsDept.label,
        updated_at: commonRegionsDept.updatedAt,
        url: commonRegionsDept.url,
      })),
    };
  }
}
