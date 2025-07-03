
import { useGetBookQuery } from '@/lib/api';
import BookForm from '@/components/BookForm';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useParams } from 'react-router';

export default function EditBook() {
  const { id } = useParams();
  const location = useLocation()

  const { data, isLoading, error } = useGetBookQuery(id);
  const book = data?.data ? data?.data:{}

  const handleCancel = () => {
    location.pathname='/books'
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-error-500 mb-4">
          <Book className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Book Not Found</h3>
        <p className="text-gray-600 mb-4">The book you're trying to edit doesn't exist.</p>
        <Button variant="outline" onClick={handleCancel}>
          Back to Books
        </Button>
      </div>
    );
  }

  return <BookForm book={book} onCancel={handleCancel} />;
}
