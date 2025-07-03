
import { useGetBookQuery } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Book } from 'lucide-react';
import { Link, useParams } from 'react-router';
import type { DBBook } from '@/types/schema';

export default function BookDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBookQuery(id);
   const book: DBBook | null = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
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
        <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
        <Link to="/books">
          <Button variant="outline">Back to Books</Button>
        </Link>
      </div>
    );
  }

  const getAvailabilityBadge = () => {
    if (book.copies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          Available
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
        Unavailable
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/books">
          <Button variant="ghost" size="sm" >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-gray-900">Book Details</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Cover Placeholder */}
            <div className="lg:w-48 lg:h-64 w-32 h-40 mx-auto lg:mx-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Book className="text-white text-4xl" />
            </div>

            {/* Book Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-1">by {book.author}</p>
                <p className="text-gray-500">{book.genre}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">ISBN</h3>
                  <p className="text-lg text-gray-900">{book.isbn}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Availability</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getAvailabilityBadge()}
                    <span className="text-sm text-gray-600">
                      {book.copies} copies
                    </span>
                  </div>
                </div>
              </div>

              {book.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link to={`/edit-book/${book._id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Book
                  </Button>
                </Link>
                {book.copies > 0 && (
                  <Link to={`/borrow/${book._id}`}>
                    <Button className="bg-success-600 hover:bg-success-700 text-white">
                      Borrow Book
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
