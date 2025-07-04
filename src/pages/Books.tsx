import { useEffect, useState } from "react";
import { useGetBooksQuery } from "@/lib/api";
import BookTable from "@/components/BookTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import type { DBBook } from "@/types/schema";
import { Link } from "react-router";
import BorrowModal from "@/components/BorrowModal";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

// const ITEMS_PER_PAGE = 5;

export default function Books() {
  const [selectedBook, setSelectedBook] = useState<DBBook | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(5);

 const { data, isLoading, error } = useGetBooksQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const books = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleBorrowClick = (book: DBBook) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  const handleCloseBorrowModal = () => {
    setIsBorrowModalOpen(false);
    setSelectedBook(null);
  };
 useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesGenre =
      genreFilter === "all" || book.genre.toLowerCase() === genreFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && book.copies > 0) ||
      (statusFilter === "unavailable" && book.copies === 0);

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const uniqueGenres = [...new Set(books.map((book) => book.genre))];

   const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
     <Loading/>
    );
  }

  if (error) {
    return (
      <Error errorTitle="Error Loading Books" errorDescription="Failed to load books. Please try again."/>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-card-foreground">All Books</h2>
          <p className="text-muted-foreground mt-1">
            Manage your library collection
          </p>
        </div>
        <Link to="/create-book">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {uniqueGenres.map((genre) => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => setItemsPerPage(Number(val))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Items Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 books per page</SelectItem>
                <SelectItem value="10">10 books per page</SelectItem>
                <SelectItem value="20">20 books per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Book Table */}
      <BookTable books={filteredBooks} onBorrowClick={handleBorrowClick} />

      {/* Pagination */}
      {
        books.length && <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      }

      {/* Borrow Modal */}
      <BorrowModal
        book={selectedBook}
        isOpen={isBorrowModalOpen}
        onClose={handleCloseBorrowModal}
      />
    </div>
  );
}
