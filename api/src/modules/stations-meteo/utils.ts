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
) => {
  const key_md5 = `RvjIvxbt ${param}${`${data.year}`.padEnd(4, '0')}${`${data.month}`.padStart(2, '0')} zKVkZsAy ${`${data.hour}`.padStart(2, '0')}${`${data.day}`.padStart(2, '0')} xDWzNuB`;
  return base64url_encode(md5(key_md5, true));
};
