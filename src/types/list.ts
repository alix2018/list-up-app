export type List = {
  name: string;
  words: Array<{ source: string; translation: string }>;
} | null;
