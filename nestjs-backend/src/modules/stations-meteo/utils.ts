import { createHash } from 'crypto';

export const strtr = (input: string, from: string, to: string): string => {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const index = from.indexOf(input[i]);
    result += index !== -1 ? to[index] : input[i];
  }
  return result;
};

export const base64url_encode = (data: string) => {
  // .rtrim( xxx , '=')
  return strtr(btoa(data), '+/', '-_').replace(/\=+$/g, '');
};

export const md5 = (str: string, binary: boolean = false) => {
  if (binary) {
    return createHash('md5').update(str).digest('binary');
  }
  return createHash('md5').update(str).digest('hex');
};

export const md5key = (
  param: string,
  data: { year: number; month: number; day: number; hour: number },
  keyPattern: string // STATIONS_METEO_PATTERN_TILES_KEY
) => {
  // We use the pattern and replace the variables in it:
  // %param% %year% %month% %day% %hour%
  const key_md5 = keyPattern.replace('%param%', param)
    .replace('%year%', `${data.year}`.padEnd(4, '0'))
    .replace('%month%', `${data.month}`.padStart(2, '0'))
    .replace('%day%', `${data.day}`.padStart(2, '0'))
    .replace('%hour%', `${data.hour}`.padStart(2, '0'));
  return base64url_encode(md5(key_md5, true));
};
