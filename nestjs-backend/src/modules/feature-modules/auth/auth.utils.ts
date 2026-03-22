import { createHash } from 'crypto';

const md5 = (text: string) => {
  return createHash('md5').update(text).digest('hex');
};

export const base64Decode = (text: string) => {
  return Buffer.from(text, 'base64').toString('utf-8');
};

export const base64Encode = (text: string) => {
  return Buffer.from(text).toString('base64');
};

// function Crypte
export const Crypte = (text: string, key: string) => {
  // Seed random with current timestamp in microseconds
  // const seed = Date.now() * 1000;
  const cleDEncryptage = md5(Math.floor(Math.random() * 32000).toString());
  let compteur = 0;
  let variableTemp = '';

  for (let ctr = 0; ctr < text.length; ctr++) {
    if (compteur === cleDEncryptage.length) {
      compteur = 0;
    }
    variableTemp +=
      cleDEncryptage[compteur] +
      String.fromCharCode(
        text.charCodeAt(ctr) ^ cleDEncryptage.charCodeAt(compteur),
      );
    compteur++;
  }
  return Buffer.from(GenerationCle(variableTemp, key)).toString('base64');
};

// function Decrypte
export function Decrypte(text: string, key: string) {
  const decodedText = GenerationCle(base64Decode(text), key);
  let variableTemp = '';
  for (let i = 0; i < decodedText.length; i++) {
    const md5: string = decodedText[i]; // one-char
    i++;
    variableTemp += String.fromCharCode(
      decodedText.charCodeAt(i) ^ md5.charCodeAt(0),
    );
  }
  return variableTemp;
}

// function GenerationCle
export const GenerationCle = (text: string, key: string) => {
  const keyMd5 = md5(key);
  let counter = 0;
  let variableTemp = '';
  for (let i = 0; i < text.length; i++) {
    if (counter === keyMd5.length) {
      counter = 0;
    }
    variableTemp += String.fromCharCode(
      text.charCodeAt(i) ^ keyMd5.charCodeAt(counter),
    );
    counter++;
  }
  return variableTemp;
};
