import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { photos } from 'prisma-v5_photolive/v5-photolive-database-client-types';
import { v5PhotolivePrismaClient } from 'src/database/v5-photolive-prisma-client';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class PhotoLiveRepository {
  private readonly v5PhotolivePrismaClient = v5PhotolivePrismaClient;
  private readonly logger = new FunctionLogger(PhotoLiveRepository.name);

  constructor() {}

  mapping(photo: photos) {
    return {
      id: photo.id,
      photoUrl: photo.photo_url,
      dhPrise: dayjs(photo.dh_prise).format('YYYY-MM-DD HH:mm:ss'),
      titre: photo.titre,
    };
  }

  // was "function get_last_eleven_photolive(): PDOStatement"
  async getLastElevenPhotolive() {
    try {
      const photos = await this.v5PhotolivePrismaClient.photos.findMany({
        where: {
          statut: '1',
        },
        orderBy: {
          dh_prise: 'desc',
        },
        take: 11,
      });
      return photos.map(this.mapping);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
