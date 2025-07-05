
import BookForm from '@/components/BookForm';
import {  useNavigate } from 'react-router';

const AddBook = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/books');
  };

  return <BookForm onCancel={handleCancel} />;
}

export default AddBook