import dayjs from 'dayjs';
import type { photos } from 'prisma-v5_photolive/v5-photolive-database-client-types';

export type PhotolivePhoto = {
  id: number;
  photoUrl: string;
  dhPrise: string;
  titre: string;
};

export const mappingPhotolivePhoto = (photo: photos): PhotolivePhoto => {
  return {
    id: photo.id,
    photoUrl: photo.photo_url,
    dhPrise: dayjs(photo.dh_prise).format('YYYY-MM-DD HH:mm:ss'),
    titre: photo.titre,
  };
};

// Custom types (service layer)

export type PhotolivePhotoWithUrlAndIsBig = PhotolivePhoto & {
  isBig: boolean;
  url: string;
};
