import { UserParams, UserVignette } from './user.types';

export const DEFAULT_USER_PARAMS: UserParams = {
  vignettes: [
    UserVignette.STATION,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
    UserVignette.PHOTO,
  ],
  stations: [['07149', 'Orly']],
};
