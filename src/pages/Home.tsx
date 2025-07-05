import BookTable from "@/components/BookTable";
import BorrowModal from "@/components/BorrowModal";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useGetBooksQuery } from "@/redux/store/api";
import {
  closeBorrowModal,
  openBorrowModal,
} from "@/redux/store/slices/modalSlice";
import type { RootState } from "@/redux/store/store";
import type { DBBook } from "@/types/schema";
import { ArrowRight, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const Home = () => {
  const { data, isError, isLoading } = useGetBooksQuery({
    limit: 10,
  });
  const dispatch = useDispatch();
  const { isBorrowModalOpen, selectedBook } = useSelector(
    (state: RootState) => state.modal
  );
  const books = Array.isArray(data?.data) ? data.data : [];

  const handleBorrowClick = (book: DBBook) => {
    dispatch(openBorrowModal(book));
  };

  const handleCloseBorrowModal = () => {
    dispatch(closeBorrowModal());
  };
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Error
        errorTitle="Error Loading Books"
        errorDescription="Failed to load books. Please try again."
      />
    );
  }
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-accent-foreground">
              Books
            </h2>
            <p className="text-accent-foreground/70 mt-1">
              Discover Your Next Book
            </p>
          </div>
          <Link to="/create-book">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add New Book
            </Button>
          </Link>
        </div>
        <BookTable books={books} onBorrowClick={handleBorrowClick} />
        <Link to="/books">
          <Button className="bg-[#03C2A6] text-white hover:bg-[#03c2a5e1]">
            Discover More
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <BorrowModal
        book={selectedBook}
        isOpen={isBorrowModalOpen}
        onClose={handleCloseBorrowModal}
      />
    </>
  );
};

export default Home;
