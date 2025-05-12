// src/components/book/BookCard.tsx
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Avatar,
  Typography,
  Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Book } from '../../types/record'
import DeleteIcon from '@mui/icons-material/Delete';
interface BookCardProps {
  book: Book;
}

export const BookCard = ({
  book,
}: BookCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardHeader
        // avatar={
        //   <Avatar sx={{ bgcolor: red[500] }} aria-label="book">
        //     {book.title[0]}
        //   </Avatar>
        // }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={book.title}
        subheader={book.author}
      />
      <CardMedia
        component="img"
        height="180"
        image={book.image}
        alt={book.title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Category: {book.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${book.price}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ marginLeft: 'auto' }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {book.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};