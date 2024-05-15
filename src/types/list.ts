export type List = {
  name: string;
  words: Word[];
} | null;

// TODO: Add id property to the type Word
export type Word = { source: string; translation: string };
