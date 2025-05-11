import axios from "axios";
import { Book } from '../../types/book';

const API_URL = 'http://localhost:5000/api/books';

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await axios.get(API_URL);
  console.log(res.data);
  return res.data.books;
}
