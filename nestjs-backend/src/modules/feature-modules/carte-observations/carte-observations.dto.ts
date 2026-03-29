import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CarteObservationItem,
  CarteObservationsResponse,
} from './carte-observations.types';

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

export class GetCarteObservationsQueryDto {
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
  z: number;

  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  retina?: boolean;

  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  webcams?: boolean;
}

export class CarteObservationItemDto {
  @IsString()
  id: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsString()
  time: string;

  @IsString()
  icon: string;

  @IsArray()
  size: [number, number];

  @IsArray()
  anchor: [number, number];

  @IsString()
  zindex: string;

  @IsNumber()
  cache: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  stid: string | null;

  static toDto(item: CarteObservationItem): CarteObservationItemDto {
    return {
      id: item.id,
      lat: item.lat,
      lon: item.lon,
      time: item.time,
      icon: item.icon,
      size: item.size,
      anchor: item.anchor,
      zindex: item.zindex,
      cache: item.cache,
      type: item.type,
      stid: item.stid,
    };
  }
}

export class GetCarteObservationsResponseDto {
  DATA: CarteObservationItemDto[];

  static toDto(
    response: CarteObservationsResponse,
  ): GetCarteObservationsResponseDto {
    return {
      DATA: response.DATA.map((item) => CarteObservationItemDto.toDto(item)),
    };
  }
}
