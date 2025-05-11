// src/pages/books/BookListPage.tsx
import { useEffect, useState } from 'react';
import { BookCard } from '../../../components/books/BookCard';
import { Book } from '../../../types/book';
import { fetchBooks } from '../../../features/common/bookAPI';


export const BookListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooksData = async () => {
    try {
      const books = await fetchBooks();
      setBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooksData();
  }, []);




  return (
    <div>
      <h1>Book List</h1>

      <div>
        {books.length === 0 ? (
          <p>No books available</p>
        ) : (
          books.map(book => (
                  <div key={book._id}>
                    <BookCard book={book}/>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
