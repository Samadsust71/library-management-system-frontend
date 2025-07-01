

export const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] as const;
type Genre = typeof genres[number];

export interface Book {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface Borrow  {
  quantity: number;
  dueDate: Date;
}


