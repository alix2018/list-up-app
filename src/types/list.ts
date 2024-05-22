import type { Word } from '@/types';

export type List = {
  name: string;
  words: Word[];
} | null;
