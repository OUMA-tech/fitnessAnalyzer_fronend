// types.ts
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  image?: string;
  description?: string,
  stock: number;
}
