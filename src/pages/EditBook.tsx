
import BookForm from '@/components/BookForm';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router';
import Loading from '@/components/Loading';
import { useGetBookQuery } from '@/redux/store/api';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetBookQuery(id);
  const book = data?.data ? data.data : {};

  const handleCancel = () => {
    navigate('/books');
  };

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-8 text-center">
        <div className="text-destructive mb-4">
          <Book className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium mb-2">Book Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The book you're trying to edit doesn't exist.
        </p>
        <Button variant="outline" onClick={handleCancel}>
          Back to Books
        </Button>
      </div>
    );
  }

  return <BookForm book={book} onCancel={handleCancel} />;
}
