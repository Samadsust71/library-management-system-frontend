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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-error-500 mb-4">
          <Search className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Books
        </h3>
        <p className="text-gray-600">Failed to load books. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-accent-foreground">All Books</h2>
          <p className="text-accent-foreground/70 mt-1">
            Manage your library collection
          </p>
        </div>
        <Link to="/create-book">
          <Button className="bg-accent/80 hover:bg-accent/90 text-accent-foreground flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
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

            {/* 👇 NEW Items Per Page */}
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
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

      {/* Borrow Modal */}
      <BorrowModal
        book={selectedBook}
        isOpen={isBorrowModalOpen}
        onClose={handleCloseBorrowModal}
      />
    </div>
  );
}
