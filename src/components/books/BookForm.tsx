// src/components/book/BookForm.tsx
import { useState, useEffect } from 'react';
import { Book } from '../../types/record';
import { TextField, Button, Box } from '@mui/material';


interface Props {
  initialData?: Book | null;
  onSubmit: (book: Omit<Book, '_id'>) => void;
}

export const BookForm = ({ initialData, onSubmit }: Props) => {
  const [form, setForm] = useState<Omit<Book, '_id'>>({
    title: '',
    author: '',
    category: '',
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mt: 2 }}
    >
      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Author"
        name="author"
        value={form.author}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        fullWidth
      />
      
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        fullWidth
      /> 
     
      <Button type="submit" variant="contained" color="primary">
        {initialData ? 'Update Book' : 'Add Book'}
      </Button>
    </Box>
  );
};
