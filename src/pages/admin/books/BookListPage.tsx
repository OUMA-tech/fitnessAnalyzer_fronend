import { DataGrid, GridColDef, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { Book } from '../../../types/record';
import { BookForm } from '../../../components/books/BookForm';
import { fetchBooks } from '../../../features/common/recordAPI';
import { addBook, updateBook, deleteBook, deleteBatchBook } from '../../../features/admin/bookAPI';

export const AdminBookListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  // const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [snackbar, setSnackbar] = useState<string>('');

  const rows: GridRowsProp = books.map((book) => ({
    id: book._id,
    title: book.title,
    author: book.author,
    category: book.category,
    price: book.price,
    stock: book.stock,
  }));

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'author', headerName: 'Author', width: 150 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

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

  const handleSubmit = async (data: Omit<Book, '_id'>) => {
    if (editingBook) {
      await updateBook(editingBook._id, data);
      setSnackbar('Book updated');
    } else {
      await addBook(data);
      setSnackbar('Book added');
    }
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteBook(id);
    setSnackbar('Book deleted');
    fetchBooks();
  };

  

  // const handleBatchDelete = async () => {
  //   await deleteBatchBook(selectionModel as string[]);
  //   setSnackbar('Books deleted');
  //   setSelectionModel([]);
  //   fetchBooks();
  // };

  return (
    <>
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <BookForm
            initialData={editingBook}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        message={snackbar}
        onClose={() => setSnackbar('')}
      />
    </Box>
    <Button
  variant="contained"
  onClick={() => {
    setEditingBook(null);  // ✅ 清空编辑状态
    setShowForm(true);     // ✅ 打开表单
  }}
>
  Add Book
</Button>
    </>
  );
};
