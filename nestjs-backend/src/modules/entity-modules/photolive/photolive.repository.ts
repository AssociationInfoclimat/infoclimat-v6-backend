import { Injectable } from '@nestjs/common';
import { v5PhotolivePrismaClient } from 'src/database/v5-photolive-prisma-client';
import { FunctionLogger } from 'src/shared/utils';
import { mappingPhotolivePhoto, PhotolivePhoto } from './photolive.types';

@Injectable()
export class PhotoLiveRepository {
  private readonly v5PhotolivePrismaClient = v5PhotolivePrismaClient;
  private readonly logger = new FunctionLogger(PhotoLiveRepository.name);

  constructor() {}

  // was "function get_last_eleven_photolive(): PDOStatement"
  async getLastElevenPhotolive(): Promise<PhotolivePhoto[]> {
    const photos = await this.v5PhotolivePrismaClient.photos.findMany({
      where: {
        statut: '1',
      },
      orderBy: {
        dh_prise: 'desc',
      },
      take: 11,
    });
    return photos.map((photo) => mappingPhotolivePhoto(photo));
  }
}
