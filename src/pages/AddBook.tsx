
import BookForm from '@/components/BookForm';
import { useLocation } from 'react-router';

export default function AddBook() {
  const location = useLocation();

  const handleCancel = () => {
    location.pathname ='/books';
  };

  return <BookForm onCancel={handleCancel} />;
}