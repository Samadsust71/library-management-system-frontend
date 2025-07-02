import { useGetBorrowSummaryQuery } from '@/lib/api';
import { Book, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function BorrowSummary() {
  const { data, isLoading, error } = useGetBorrowSummaryQuery(undefined);
  const borrowSummary = Array.isArray(data?.data) ? data.data : [];

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
    const formatted = format(dueDate, 'MMM dd, yyyy');
    return { formatted, isOverdue };
  };

  const overdueBooks = borrowSummary.filter(item => {
    const latest = getLatestDueDate(item.dueDates);
    return latest && new Date(latest) < today;
  }).length;

  const getBookColor = (index: number) => {
    const colors = [
      'from-primary-500 to-primary-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
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
          <Clock className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Summary</h3>
        <p className="text-gray-600">Failed to load borrow summary. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Borrow Summary</h2>
        <p className="text-gray-600 mt-1">Overview of all borrowed books</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Book className="text-primary-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books Borrowed</p>
              <p className="text-2xl font-semibold text-gray-900">{totalBooksCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success-50 rounded-lg">
              <Users className="text-success-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Borrowers</p>
              <p className="text-2xl font-semibold text-gray-900">{activeBorrowers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning-50 rounded-lg">
              <Clock className="text-warning-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-semibold text-gray-900">{overdueBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrowed Books Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Borrowed Books Details</h3>
        </div>

        {borrowSummary.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Book className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
            <p className="text-gray-600">No books have been borrowed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Borrowed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowSummary.map((item, index) => {
                  const latest = getLatestDueDate(item.dueDates);
                  const { formatted: dueDate, isOverdue } = latest
                    ? formatDueDate(latest)
                    : { formatted: 'N/A', isOverdue: false };

                  return (
                    <tr key={item.book.title}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-12 bg-gradient-to-br ${getBookColor(index)} rounded flex items-center justify-center flex-shrink-0`}>
                            <Book className="text-white text-xs" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.book.title}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 hidden md:table-cell">{item.book.isbn}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                          {item.totalQuantity} copies
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isOverdue ? (
                          <span className="text-sm text-error-600 font-medium">{dueDate} (Overdue)</span>
                        ) : (
                          <span className="text-sm text-gray-900">{dueDate}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
