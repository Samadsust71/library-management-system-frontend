
import BookForm from '@/components/BookForm';
import {  useNavigate } from 'react-router';

export default function AddBook() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/books');
  };

  return <BookForm onCancel={handleCancel} />;
}