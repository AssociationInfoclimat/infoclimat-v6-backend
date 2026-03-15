import { lexique } from 'prisma-dico/dico-database-client-types';
import { slugify } from 'src/shared/utils';

// Repo types:

export type LexiqueWord = {
  id: number;
  slug: string;
  mot: string;
};

export const mappingLexiqueWord = (word: lexique): LexiqueWord => {
  return {
    id: word.id,
    slug: slugify(word.mot),
    mot: word.mot.charAt(0).toUpperCase() + word.mot.slice(1), // ucfirst
  };
};
