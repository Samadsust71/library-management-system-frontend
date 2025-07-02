import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Book as BookIcon, Edit, Eye, HandHeart, Trash2 } from 'lucide-react';
import type {  DBBook } from '@/types/schema';
import { toast } from 'sonner';
import { useDeleteBookMutation } from "@/lib/api";
import { Link } from "react-router";


interface BookTableProps {
  books: DBBook[];
  onBorrowClick: (book: DBBook) => void;
}

export default function BookTable({ books, onBorrowClick }: BookTableProps) {
  const [deleteBook] = useDeleteBookMutation();

  const handleDelete = async (book: DBBook) => {
    try {
      await deleteBook(book._id).unwrap();
      toast.success(`"${book.title}" has been successfully deleted.`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete book');
    }
  };

  const getAvailabilityBadge = (book: DBBook) => {
    return book.copies > 0 ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
        Available
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-50 text-error-700">
        Unavailable
      </span>
    );
  };

  const getBookColor = (index: number) => {
    const colors = [
      'from-primary-500 to-primary-600',
      'from-warning-500 to-warning-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-400 mb-4">
          <BookIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first book to the library.</p>
        <Link to="/create-book">
          <Button className="bg-primary-600 hover:bg-primary-700">Add Your First Book</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Details</TableHead>
              <TableHead className="hidden md:table-cell">ISBN</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book, index) => (
              <TableRow key={book._id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-16 bg-gradient-to-br ${getBookColor(index)} rounded flex items-center justify-center`}>
                      <BookIcon className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500 mt-1">{book.genre}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell text-sm text-gray-900">{book.isbn}</TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getAvailabilityBadge(book)}
                    <span className="text-xs text-gray-500">
                      {book.copies} copies
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`/books/${book._id}`}>
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link to={`/edit-book/${book._id}`}>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={book.copies > 0 ? 'text-success-600 hover:text-success-700 hover:bg-success-50' : 'text-gray-400 cursor-not-allowed'}
                      disabled={book.copies === 0}
                      onClick={() => onBorrowClick(book)}
                    >
                      <HandHeart className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-error-600 hover:text-error-700 hover:bg-error-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{book.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(book)} className="bg-error-600 hover:bg-error-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
