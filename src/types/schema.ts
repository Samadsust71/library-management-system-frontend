

export const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] as const;
export type Genre = typeof genres[number];

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
  book:{
    title:string;
    isbn:string
  };
  totalQuantity: number;
  dueDates: string[];
}
// export interface DBBorrow extends Borrow  {
//   _id:string;

// }
export interface DBBook extends Book {
  _id: string; 
  createdAt: Date; 
  updatedAt: Date; 
}

