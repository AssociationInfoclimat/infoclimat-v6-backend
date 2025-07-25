import { Injectable } from '@nestjs/common';
import { PhotoLiveRepository } from './photo-live.repository';
import { FunctionLogger, slugify } from 'src/shared/utils';

@Injectable()
export class PhotoLiveService {
  private readonly logger = new FunctionLogger(PhotoLiveService.name);
  constructor(private readonly photoLiveRepository: PhotoLiveRepository) {}

  // was in "menu_desktop.inc.php"
  async getLastElevenPhotolive() {
    try {
      const photos = await this.photoLiveRepository.getLastElevenPhotolive();

      const nthBig = Math.floor(Math.random() * 10);
      let i = 0;

      return photos.map((photo) => {
        const photoData = {
          id: photo.id,
          isBig: i === nthBig,
          photoUrl: `https://www.infoclimat.fr/photolive/photos/${photo.dhPrise.substring(0, 7)}/${photo.photoUrl.replace('.jpg', '_m.jpg')}`,
          url: `https://www.infoclimat.fr/photolive-photos-meteo-${photo.id}-${slugify(photo.titre)}.html`,
          dhPrise: photo.dhPrise,
          titre: photo.titre,
        };
        i++;
        return photoData;
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
