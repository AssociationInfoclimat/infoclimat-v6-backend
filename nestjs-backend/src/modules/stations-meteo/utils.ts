import { base64url_encode, md5 } from 'src/shared/utils';

export const md5key = (
  param: string,
  data: { year: number; month: number; day: number; hour: number },
  keyPattern: string, // STATIONS_METEO_PATTERN_TILES_KEY
) => {
  // We use the pattern and replace the variables in it:
  // %param% %year% %month% %day% %hour%
  const key_md5 = keyPattern
    .replace('%param%', param)
    .replace('%year%', `${data.year}`.padEnd(4, '0'))
    .replace('%month%', `${data.month}`.padStart(2, '0'))
    .replace('%day%', `${data.day}`.padStart(2, '0'))
    .replace('%hour%', `${data.hour}`.padStart(2, '0'));
  return base64url_encode(md5(key_md5, true));
};
