import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CarteStationDataItem,
  CarteStationParam,
  CarteStationResponse,
} from './carte-station.types';
import { ApiProperty } from '@nestjs/swagger';

const toBoolean = ({ value }: { value: unknown }): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value === '' || value === '0' || value.toLowerCase() === 'false') {
      return false;
    }
    return true;
  }
  return Boolean(value);
};

export class GetCarteStationQueryDto {
  @Type(() => Number)
  @IsNumber()
  west: number;

  @Type(() => Number)
  @IsNumber()
  east: number;

  @Type(() => Number)
  @IsNumber()
  south: number;

  @Type(() => Number)
  @IsNumber()
  north: number;

  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsString()
  month: string;

  @Type(() => Number)
  @IsNumber()
  day: number;

  @Type(() => Number)
  @IsNumber()
  hour: number;

  @IsString()
  param: CarteStationParam;

  @Type(() => Number)
  @IsNumber()
  z: number;

  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  retina?: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  density?: number;

  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  'official-only'?: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  'no-clustering'?: number;
}

export class CarteStationDataItemDto {
  static toDto(item: CarteStationDataItem): CarteStationDataItemDto {
    return {
      id: item.id,
      lat: item.lat,
      lon: item.lon,
      t: item.t,
      icon: item.icon,
      size: item.size,
      anchor: item.anchor,
      _uid: item._uid,
      auid: item.auid,
      _ty: item._ty,
      meta: item.meta,
    };
  }

  id: number;
  lat: number;
  lon: number;
  t: number;
  icon: string;
  size: [number, number];
  anchor: [number, number];
  _uid: string;
  auid: string;
  _ty: string;
  meta: Record<string, unknown> | false;
}

export class GetCarteStationResponseDto {
  @ApiProperty({
    description: 'API metadata for the response',
    type: Object,
  })
  API: {
    status: string;
    errorcode: string | null;
    errormsg: string | null;
    time: number;
  };

  @ApiProperty({
    description: 'Data for the response',
    type: [CarteStationDataItemDto],
  })
  DATA: CarteStationDataItemDto[];

  static toDto(response: CarteStationResponse): GetCarteStationResponseDto {
    return {
      API: {
        status: 'OK',
        errorcode: null,
        errormsg: null,
        time: response.elapsed,
      },
      DATA: response.data.map((item) => CarteStationDataItemDto.toDto(item)),
    };
  }
}
