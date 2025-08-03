import { Logger } from '@nestjs/common';
import { createHash } from 'crypto';

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

class HTMLEntityDecode {
  private escapeMap: Record<string, string>;
  private escapeMapRegex: RegExp;

  constructor() {
    // Keys are HTML entities (ex: &nbsp; -> 'nbsp' key)
    // Values are the corresponding characters
    this.escapeMap = {
      nbsp: ' ',
      iexcl: '¡',
      cent: '¢',
      pound: '£',
      curren: '¤',
      yen: '¥',
      brvbar: '¦',
      sect: '§',
      uml: '¨',
      copy: '©',
      ordf: 'ª',
      laquo: '«',
      not: '¬',
      reg: '®',
      macr: '¯',
      deg: '°',
      plusmn: '±',
      sup2: '²',
      sup3: '³',
      acute: '´',
      micro: 'µ',
      para: '¶',
      middot: '·',
      cedil: '¸',
      sup1: '¹',
      ordm: 'º',
      raquo: '»',
      frac14: '¼',
      frac12: '½',
      frac34: '¾',
      iquest: '¿',
      Agrave: 'À',
      Aacute: 'Á',
      Acirc: 'Â',
      Atilde: 'Ã',
      Auml: 'Ä',
      Aring: 'Å',
      AElig: 'Æ',
      Ccedil: 'Ç',
      Egrave: 'È',
      Eacute: 'É',
      Ecirc: 'Ê',
      Euml: 'Ë',
      Igrave: 'Ì',
      Iacute: 'Í',
      Icirc: 'Î',
      Iuml: 'Ï',
      ETH: 'Ð',
      Ntilde: 'Ñ',
      Ograve: 'Ò',
      Oacute: 'Ó',
      Ocirc: 'Ô',
      Otilde: 'Õ',
      Ouml: 'Ö',
      times: '×',
      Oslash: 'Ø',
      Ugrave: 'Ù',
      Uacute: 'Ú',
      Ucirc: 'Û',
      Uuml: 'Ü',
      Yacute: 'Ý',
      THORN: 'Þ',
      szlig: 'ß',
      agrave: 'à',
      aacute: 'á',
      acirc: 'â',
      atilde: 'ã',
      auml: 'ä',
      aring: 'å',
      aelig: 'æ',
      ccedil: 'ç',
      egrave: 'è',
      eacute: 'é',
      ecirc: 'ê',
      euml: 'ë',
      igrave: 'ì',
      iacute: 'í',
      icirc: 'î',
      iuml: 'ï',
      eth: 'ð',
      ntilde: 'ñ',
      ograve: 'ò',
      oacute: 'ó',
      ocirc: 'ô',
      otilde: 'õ',
      ouml: 'ö',
      divide: '÷',
      oslash: 'ø',
      ugrave: 'ù',
      uacute: 'ú',
      ucirc: 'û',
      uuml: 'ü',
      yacute: 'ý',
      thorn: 'þ',
      yuml: 'ÿ',
      fnof: 'ƒ',
      Alpha: 'Α',
      Beta: 'Β',
      Gamma: 'Γ',
      Delta: 'Δ',
      Epsilon: 'Ε',
      Zeta: 'Ζ',
      Eta: 'Η',
      Theta: 'Θ',
      Iota: 'Ι',
      Kappa: 'Κ',
      Lambda: 'Λ',
      Mu: 'Μ',
      Nu: 'Ν',
      Xi: 'Ξ',
      Omicron: 'Ο',
      Pi: 'Π',
      Rho: 'Ρ',
      Sigma: 'Σ',
      Tau: 'Τ',
      Upsilon: 'Υ',
      Phi: 'Φ',
      Chi: 'Χ',
      Psi: 'Ψ',
      Omega: 'Ω',
      alpha: 'α',
      beta: 'β',
      gamma: 'γ',
      delta: 'δ',
      epsilon: 'ε',
      zeta: 'ζ',
      eta: 'η',
      theta: 'θ',
      iota: 'ι',
      kappa: 'κ',
      lambda: 'λ',
      mu: 'μ',
      nu: 'ν',
      xi: 'ξ',
      omicron: 'ο',
      pi: 'π',
      rho: 'ρ',
      sigmaf: 'ς',
      sigma: 'σ',
      tau: 'τ',
      upsilon: 'υ',
      phi: 'φ',
      chi: 'χ',
      psi: 'ψ',
      omega: 'ω',
      thetasym: 'ϑ',
      upsih: 'ϒ',
      piv: 'ϖ',
      bull: '•',
      hellip: '…',
      prime: '′',
      Prime: '″',
      oline: '‾',
      frasl: '⁄',
      weierp: '℘',
      image: 'ℑ',
      real: 'ℜ',
      trade: '™',
      alefsym: 'ℵ',
      larr: '←',
      uarr: '↑',
      rarr: '→',
      darr: '↓',
      harr: '↔',
      crarr: '↵',
      lArr: '⇐',
      uArr: '⇑',
      rArr: '⇒',
      dArr: '⇓',
      hArr: '⇔',
      forall: '∀',
      part: '∂',
      exist: '∃',
      empty: '∅',
      nabla: '∇',
      isin: '∈',
      notin: '∉',
      ni: '∋',
      prod: '∏',
      sum: '∑',
      minus: '−',
      lowast: '∗',
      radic: '√',
      prop: '∝',
      infin: '∞',
      ang: '∠',
      and: '∧',
      or: '∨',
      cap: '∩',
      cup: '∪',
      int: '∫',
      there4: '∴',
      sim: '∼',
      cong: '≅',
      asymp: '≈',
      ne: '≠',
      equiv: '≡',
      le: '≤',
      ge: '≥',
      sub: '⊂',
      sup: '⊃',
      nsub: '⊄',
      sube: '⊆',
      supe: '⊇',
      oplus: '⊕',
      otimes: '⊗',
      perp: '⊥',
      sdot: '⋅',
      lceil: '⌈',
      rceil: '⌉',
      lfloor: '⌊',
      rfloor: '⌋',
      lang: '〈',
      rang: '〉',
      loz: '◊',
      spades: '♠',
      clubs: '♣',
      hearts: '♥',
      diams: '♦',
      quot: '"',
      amp: '&',
      lt: '<',
      gt: '>',
      OElig: 'Œ',
      oelig: 'œ',
      Scaron: 'Š',
      scaron: 'š',
      Yuml: 'Ÿ',
      circ: 'ˆ',
      tilde: '˜',
      ndash: '–',
      mdash: '—',
      lsquo: '‘',
      rsquo: '’',
      sbquo: '‚',
      ldquo: '“',
      rdquo: '”',
      bdquo: '„',
      dagger: '†',
      Dagger: '‡',
      permil: '‰',
      lsaquo: '‹',
      rsaquo: '›',
      euro: '€',
    };
  }

  decode(strToDecode: string) {
    if (!this.escapeMapRegex) {
      this.escapeMapRegex = new RegExp(
        '&(' + Object.keys(this.escapeMap).join('|') + ');',
        'g',
      );
    }
    return strToDecode.replace(this.escapeMapRegex, (x) => {
      return this.escapeMap[x.substring(1, x.length - 1)] || x;
    });
  }
}

export const replaceAccents = (word: string) => {
  return new HTMLEntityDecode().decode(word);
};

//
// From PHP: get_slug(string $name): string
//
export const slugify = (word: string) => {
  if (word.length > 120) {
    word = word.substring(0, 120);
  }

  let normalizedWord = replaceAccents(word);

  // Replace any non-alphanumeric characters with hyphens
  normalizedWord = normalizedWord.replace(/[^a-zA-Z0-9-]/g, '-');

  // Convert to lowercase
  normalizedWord = normalizedWord.toLowerCase();

  // Replace multiple consecutive hyphens with a single hyphen
  return normalizedWord.replace(/-+/g, '-');
};

// From PHP : function strtourl($str)
export const strToUrl = (str: string) => {
  if (str.length > 120) {
    str = str.substring(0, 120);
  }
  const normalizedWord = replaceAccents(str);
  return normalizedWord
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/\-\+/g, '-');
};

export const stripTags = (str: string) => {
  return str.replace(/<[^>]*>?/g, '');
};

export const md5 = (str: string, binary: boolean = false) => {
  if (binary) {
    return createHash('md5').update(str).digest('binary');
  }
  return createHash('md5').update(str).digest('hex');
};

// Adapted from https://locutus.io/php/strings/strtr/
//  for strings only (trFrom and trTo are strings)
export const strtr = (str: string, trFrom: string, trTo: string) => {
  //  discuss at: https://locutus.io/php/strtr/
  // original by: Brett Zamir (https://brett-zamir.me)
  //    input by: uestla
  //    input by: Alan C
  //    input by: Taras Bogach
  //    input by: jpfle
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  //   example 1: var $trans = {'hello' : 'hi', 'hi' : 'hello'}
  //   example 1: strtr('hi all, I said hello', $trans)
  //   returns 1: 'hello all, I said hi'
  //   example 2: strtr('äaabaåccasdeöoo', 'äåö','aao')
  //   returns 2: 'aaabaaccasdeooo'
  //   example 3: strtr('ääääääää', 'ä', 'a')
  //   returns 3: 'aaaaaaaa'
  //   example 4: strtr('http', 'pthxyz','xyzpth')
  //   returns 4: 'zyyx'
  //   example 5: strtr('zyyx', 'pthxyz','xyzpth')
  //   returns 5: 'http'
  let i = 0;
  let j = 0;
  let lenStr = 0;
  let lenFrom = 0;

  let istr = '';
  let ret = '';
  let match = false;

  // Walk through subject and replace chars when needed
  lenStr = str.length;
  lenFrom = trFrom.length;

  for (i = 0; i < lenStr; i++) {
    match = false;

    istr = str.charAt(i);
    for (j = 0; j < lenFrom; j++) {
      if (istr === trFrom.charAt(j)) {
        match = true;
        break;
      }
    }

    if (match) {
      ret += trTo.charAt(j);
    } else {
      ret += str.charAt(i);
    }
  }
  return ret;
};

export const base64url_encode = (data: string) => {
  // .rtrim( xxx , '=')
  return strtr(btoa(data), '+/', '-_').replace(/\=+$/g, '');
};

export const getIPFromRequest = (req: Request) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor || (req as any)?.socket?.remoteAddress;
  return ip;
};
