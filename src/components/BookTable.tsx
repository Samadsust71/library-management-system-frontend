import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Book as BookIcon, Edit, Eye, HandHeart, Trash2 } from "lucide-react";
import type { DBBook } from "@/types/schema";
import { toast } from "sonner";
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
      toast.error(error.data?.message || "Failed to delete book");
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
      "from-emerald-400 to-emerald-500",
      "from-cyan-500 to-cyan-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-blue-500 to-blue-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[index % colors.length];
  };

  if (books.length === 0) {
    return (
      <div className="bg-card  text-card-foreground rounded-lg shadow-sm border p-8 text-center">
        <div className="text-muted-foreground/70 mb-4">
          <BookIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-2">No books found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by adding your first book to the library.
        </p>
        <Link to="/create-book">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Your First Book
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
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
                    <div
                      className={`w-12 h-16 bg-gradient-to-br ${getBookColor(
                        index
                      )} rounded flex items-center justify-center`}
                    >
                      <BookIcon className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-card-foreground">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.genre}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell text-sm text-card-foreground">
                  {book.isbn}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getAvailabilityBadge(book)}
                    <span className="text-xs text-muted-foreground">
                      {book.copies} copies
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`/books/${book._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-fuchsia-500 hover:text-fuchsia-600 hover:bg-fuchsia-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link to={`/edit-book/${book._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        book.copies > 0
                          ? "text-green-400 hover:text-green-500 hover:bg-green-50"
                          : "text-muted-foreground cursor-not-allowed"
                      }
                      disabled={book.copies === 0}
                      onClick={() => onBorrowClick(book)}
                    >
                      <HandHeart className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{book.title}"? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book)}
                            className="bg-red-400 hover:bg-red-500 text-white"
                          >
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
