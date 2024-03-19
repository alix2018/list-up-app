import type { List } from '@/types';

// export type Users = User[] | null;
export type User = {
  name: string;
  lists: List[];
} | null;
