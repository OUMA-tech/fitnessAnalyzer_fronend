import axios from "axios";
import { Book } from '../../types/record';
import { store } from '../../store/store';

const API_URL = 'http://localhost:5000/api/books';
const getAuthHeader = () => {
  const token = store.getState().auth.user.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 添加书籍
export const addBook = async (data: Omit<Book, '_id'>): Promise<Book> => {
  console.log(data);
  const res = await axios.post(API_URL, data, getAuthHeader());
  return res.data;
};

// 更新书籍
export const updateBook = async (id: string, data: Omit<Book, '_id'>): Promise<Book> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

// 删除书籍
export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const deleteBatchBook = async (ids: string[]): Promise<void> => {
  await axios.delete(`${API_URL}/${ids}`);
}