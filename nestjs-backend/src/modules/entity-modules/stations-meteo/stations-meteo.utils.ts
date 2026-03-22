import { config } from 'src/config/config';
import { base64url_encode, md5 } from 'src/shared/utils';

export const md5key = ({
  param,
  data,
  keyPattern,
}: {
  param: string;
  data: { year: number; month: number; day: number; hour: number };
  keyPattern?: string;
}): string => {
  // We use the pattern and replace the variables in it:
  // %param% %year% %month% %day% %hour%
  const key_md5 = (keyPattern ?? config.STATIONS_METEO_PATTERN_TILES_KEY)
    .replace('%param%', param) // %param% is in the pattern but might be empty
    .replace('%year%', `${data.year}`.padEnd(4, '0'))
    .replace('%month%', `${data.month}`.padStart(2, '0'))
    .replace('%day%', `${data.day}`.padStart(2, '0'))
    .replace('%hour%', `${data.hour}`.padStart(2, '0'));
  return base64url_encode(md5(key_md5, true));
};
