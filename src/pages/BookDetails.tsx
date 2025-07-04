import { useGetBookQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Book } from "lucide-react";
import { Link, useParams } from "react-router";
import type { DBBook } from "@/types/schema";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useState } from "react";
import BorrowModal from "@/components/BorrowModal";

const BookDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBookQuery(id);
  const [selectedBook, setSelectedBook] = useState<DBBook | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const book: DBBook | null = data?.data ?? null;

  const handleBorrowClick = (book: DBBook) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };
  const handleCloseBorrowModal = () => {
    setIsBorrowModalOpen(false);
    setSelectedBook(null);
  };
  if (isLoading) {
    return <Loading />;
  }

  if (error || !book) {
    return (
      <Error
        errorTitle="Book Not Found"
        errorDescription="The book you're looking for doesn't exist."
        isLinkAvailable={true}
        href="books"
        linkTitle="Back to Books"
      />
    );
  }

  const getAvailabilityBadge = () => {
    if (book.copies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
          Available
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
        Unavailable
      </span>
    );
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/books">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-card-foreground">
          Book Details
        </h2>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Cover Placeholder */}
            <div className="lg:w-48 lg:h-64 w-32 h-40 mx-auto lg:mx-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Book className="text-white text-4xl" />
            </div>

            {/* Book Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-card-foreground mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-1">
                  by {book.author}
                </p>
                <p className="text-sm text-muted-foreground">{book.genre}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    ISBN
                  </h3>
                  <p className="text-lg text-card-foreground">{book.isbn}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Availability
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getAvailabilityBadge()}
                    <span className="text-sm text-muted-foreground">
                      {book.copies} copies
                    </span>
                  </div>
                </div>
              </div>

              {book.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
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
                  
                    <Button onClick={()=>handleBorrowClick(book)} >Borrow Book</Button>
          
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BorrowModal
        book={selectedBook}
        isOpen={isBorrowModalOpen}
        onClose={handleCloseBorrowModal}
      />
    </>
  );
};
export default BookDetails;
