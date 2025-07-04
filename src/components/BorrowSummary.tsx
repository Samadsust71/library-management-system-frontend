import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBorrowSummaryQuery } from "@/lib/api";
import { Book, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Borrow } from "@/types/schema";
import Loading from "./Loading";
import Error from "./Error";
import { getBookColor } from "@/lib/utils";

export default function BorrowSummary() {
  const { data, isLoading, error } = useGetBorrowSummaryQuery(undefined);
  const borrowSummary: Borrow[] = Array.isArray(data?.data) ? data.data : [];

  const totalBooksCount = borrowSummary.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );
  const activeBorrowers = borrowSummary.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLatestDueDate = (dueDates: string[]) => {
    if (!dueDates || dueDates.length === 0) return null;
    return dueDates.reduce((latest, current) =>
      new Date(current) > new Date(latest) ? current : latest
    );
  };

  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const isOverdue = dueDate < today;
    const formatted = format(dueDate, "MMM dd, yyyy");
    return { formatted, isOverdue };
  };

  const overdueBooks = borrowSummary.filter((item) => {
    const latest = getLatestDueDate(item.dueDates);
    return latest && new Date(latest) < today;
  }).length;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        errorTitle="Error Loading Summary"
        errorDescription="Failed to load borrow summary. Please try again."
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Borrow Summary
        </h2>
        <p className="text-muted-foreground mt-1">
          Overview of all borrowed books
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Book className="text-primary text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Books Borrowed
              </p>
              <p className="text-2xl font-semibold text-card-foreground">
                {totalBooksCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <Users className="text-success text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Borrowers
              </p>
              <p className="text-2xl font-semibold text-card-foreground">
                {activeBorrowers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="text-warning text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Overdue Books
              </p>
              <p className="text-2xl font-semibold text-card-foreground">
                {overdueBooks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-card-foreground">
            Borrowed Books Details
          </h3>
        </div>

        {borrowSummary.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-muted-foreground/70 mb-4">
              <Book className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              No borrowed books
            </h3>
            <p className="text-muted-foreground">
              No books have been borrowed yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead className="hidden md:table-cell">ISBN</TableHead>
                  <TableHead>Total Borrowed</TableHead>
                  <TableHead>Latest Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowSummary.map((item, index) => {
                  const latest = getLatestDueDate(item.dueDates);
                  const { formatted: dueDate, isOverdue } = latest
                    ? formatDueDate(latest)
                    : { formatted: "N/A", isOverdue: false };

                  return (
                    <TableRow key={item.book.title}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-12 bg-gradient-to-br ${getBookColor(
                              index
                            )} rounded flex items-center justify-center flex-shrink-0`}
                          >
                            <Book className="text-white text-xs" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-card-foreground">
                              {item.book.title}
                            </h4>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-card-foreground">
                        {item.book.isbn}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item.totalQuantity} copies
                        </span>
                      </TableCell>
                      <TableCell>
                        {isOverdue ? (
                          <span className="text-sm text-error font-medium">
                            {dueDate} (Overdue)
                          </span>
                        ) : (
                          <span className="text-sm text-card-foreground">
                            {dueDate}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
