export type List = {
  name: string;
  words: Word[];
} | null;

export type Word = { source: string; translation: string };
