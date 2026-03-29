import type {
  VignetteCrue,
  VignettePhoto,
  VignettesReponse,
  VignetteStation,
  VignetteVigilance,
} from './vignettes.types';

export class VignetteStationResponseDto {
  type: 'station';
  content_as_html: string; // TODO: Build this as a json from the station. For now its the HTML of the station weather information.

  static toDto(vignette: VignetteStation): VignetteStationResponseDto {
    return {
      type: 'station',
      content_as_html: vignette.contentAsHtml,
    };
  }
}

export class VignettePhotoResponseDto {
  type: 'photo';
  time_key: number;
  photo_index: number;
  background_position: [number, number]; // [x, y]

  static toDto(vignette: VignettePhoto): VignettePhotoResponseDto {
    return {
      type: 'photo',
      time_key: vignette.timeKey,
      photo_index: vignette.photoIndex,
      background_position: vignette.backgroundPosition,
    };
  }
}

export class VignetteVigilanceResponseDto {
  type: 'vigilance';
  content_as_html: string; // TODO: Build this as a json from the vigilance. For now its the HTML of the vigilance.

  static toDto(vignette: VignetteVigilance): VignetteVigilanceResponseDto {
    return {
      type: 'vigilance',
      content_as_html: vignette.contentAsHtml,
    };
  }
}

export class VignetteCrueResponseDto {
  type: 'crue';
  content_as_html: string; // TODO: Build this as a json from the crue. For now its the HTML of the crue.

  static toDto(vignette: VignetteCrue): VignetteCrueResponseDto {
    return {
      type: 'crue',
      content_as_html: vignette.contentAsHtml,
    };
  }
}

export class VignettesReponseResponseDto {
  vignettes: (
    | VignetteStationResponseDto
    | VignettePhotoResponseDto
    | VignetteVigilanceResponseDto
    | VignetteCrueResponseDto
  )[];

  photos_sprite_url: string;

  static toDto(
    vignettesReponse: VignettesReponse,
  ): VignettesReponseResponseDto {
    return {
      vignettes: vignettesReponse.vignettes.map((vignette) => {
        if (vignette.type === 'station') {
          return VignetteStationResponseDto.toDto(vignette);
        } else if (vignette.type === 'photo') {
          return VignettePhotoResponseDto.toDto(vignette);
        } else if (vignette.type === 'vigilance') {
          return VignetteVigilanceResponseDto.toDto(vignette);
        } else if (vignette.type === 'crue') {
          return VignetteCrueResponseDto.toDto(vignette);
        } else {
          throw new Error(`errors.vignettes.unknown_vignette_type`);
        }
      }),
      photos_sprite_url: vignettesReponse.photosSpriteUrl,
    };
  }
}
