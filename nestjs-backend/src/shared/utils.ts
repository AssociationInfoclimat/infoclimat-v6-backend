import { Logger } from '@nestjs/common';

export class FunctionLogger extends Logger {
  _getCallerFnName(stack: any) {
    const caller = stack
      .split('\n')[2]
      .trim()
      .split(' ')[1] // this gives `<ClassName>.<functionName>`
      .trim()
      .split('.')[1];
    if (!caller) {
      // We're probably calling the logger from an anonymous function in the caller Service method,
      //  let'look in n+1 parent:
      return stack.split('\n')[3].trim().split(' ')[1].trim().split('.')[1];
    }
    return caller;
  }
  log(log: string): void {
    super.log(`[${this._getCallerFnName(new Error().stack)}] ${log}`);
  }
  warn(log: string): void {
    super.warn(`[${this._getCallerFnName(new Error().stack)}] ${log}`);
  }
  error(log: string): void {
    super.error(`[${this._getCallerFnName(new Error().stack)}] ${log}`);
  }
  debug(log: string): void {
    super.debug(`[${this._getCallerFnName(new Error().stack)}] ${log}`);
  }
}

const snakeCase = <T extends string>(str: T): CamelToSnake<T> => {
  return (
    str
      // ABc -> a_bc
      .replace(/([A-Z])([A-Z])([a-z])/g, '$1_$2$3')
      // aC -> a_c
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase() as CamelToSnake<T>
  );
};

// To return a public API response
//  -> plain text snake-cased
export const toSnakeCase = <T>(data: T): Snakification<T> => {
  if (Array.isArray(data)) {
    return data.map((datum) => toSnakeCase(datum)) as Snakification<T>;
  } else if (
    data &&
    Object.prototype.toString.call(data) === '[object Object]' &&
    typeof data === 'object'
  ) {
    return Object.keys(data).reduce(
      (a, c) =>
        Object.assign(a, { [snakeCase(c)]: toSnakeCase((data as any)[c]) }),
      {},
    ) as Snakification<T>;
  } else {
    return data as Snakification<T>;
  }
};

type CamelToSnake<T extends string, P extends string = ''> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
    ? CamelToSnake<
        R,
        `${P}${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}`
      >
    : P;

export type Snakification<T> = T extends readonly any[]
  ? { [K in keyof T]: Snakification<T[K]> }
  : T extends object
    ? T extends Date
      ? Date
      : {
          [K in keyof T as CamelToSnake<Extract<K, string>>]: Snakification<
            T[K]
          >;
        }
    : T;

export type MockedResponseType<T> = T extends readonly any[]
  ? { [K in keyof T]: MockedResponseType<T[K]> }
  : T extends object
    ? T extends Date
      ? string
      : {
          [K in keyof T as CamelToSnake<
            Extract<K, string>
          >]: MockedResponseType<T[K]>;
        }
    : T;

export const isStagingEnv = () => {
  return (
    process.env.HOST &&
    (process.env.HOST.indexOf('staging') > -1 ||
      process.env.HOST.indexOf('localhost') > -1 ||
      process.env.HOST.indexOf('127.0.0.1') > -1)
  );
};

//
// From PHP: get_slug(string $name): string
//
export const slugify = (word: string) => {
  if (word.length > 120) {
    word = word.substring(0, 120);
  }

  const accents = [
    'á',
    'à',
    'â',
    'é',
    'è',
    'ê',
    'í',
    'î',
    'ó',
    'ò',
    'ô',
    'œ',
    'ú',
    'ù',
    'û',
    'ü',
    '¨',
    'ñ',
    'ç',
    ' ',
    '&',
    '°',
    '\\.',
    ',',
    ';',
    '\\!',
    '\\?',
    ' - ',
    '_',
    '  ',
    '\\.\\.\\.',
    '\\^',
    '\\(',
    '\\)',
  ];
  const replace = [
    'a',
    'a',
    'a',
    'e',
    'e',
    'e',
    'i',
    'i',
    'o',
    'o',
    'o',
    'oe',
    'u',
    'u',
    'u',
    'u',
    'u',
    'n',
    'c',
    '',
    '',
    'degres',
    '',
    '-',
    '',
    '',
    '',
    '-',
    '',
    '-',
    '',
    '',
    '',
    '',
  ];

  // Convert HTML entities to their corresponding characters
  let normalizedWord = word.trim();

  // Replace accents and special characters
  for (let i = 0; i < accents.length; i++) {
    normalizedWord = normalizedWord.replace(
      new RegExp(accents[i], 'g'),
      replace[i],
    );
  }

  // Replace any non-alphanumeric characters with hyphens
  normalizedWord = normalizedWord.replace(/[^a-zA-Z0-9-]/g, '-');

  // Convert to lowercase
  normalizedWord = normalizedWord.toLowerCase();

  // Replace multiple consecutive hyphens with a single hyphen
  return normalizedWord.replace(/-+/g, '-');
};
