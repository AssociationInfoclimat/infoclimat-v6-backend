import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { PhotolivePhotoWithUrlAndIsBig } from './photolive.types';

export class GetLastElevenPhotoliveDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  is_big: boolean;

  @IsString()
  photo_url: string;

  @IsString()
  url: string;

  @IsString()
  dh_prise: string;

  @IsString()
  titre: string;

  static toDto(
    photo: PhotolivePhotoWithUrlAndIsBig,
  ): GetLastElevenPhotoliveDto {
    return {
      id: photo.id,
      is_big: photo.isBig,
      photo_url: photo.photoUrl,
      url: photo.url,
      dh_prise: photo.dhPrise,
      titre: photo.titre,
    };
  }
}
