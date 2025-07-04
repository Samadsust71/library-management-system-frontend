import type { DBBook } from '@/types/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PaginatedBooksResponse {
  data: DBBook[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://library-management-app-eta.vercel.app/api',
  }),
  tagTypes: ['Book', 'BorrowRecord', 'BorrowSummary'],
  endpoints: (builder) => ({
    getBooks: builder.query<PaginatedBooksResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/books?page=${page}&limit=${limit}`,
      providesTags: ['Book'],
    }),

    getBook: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (id) => [{ type: 'Book', id }],
    }),

    createBook: builder.mutation({
      query: (book) => ({
        url: '/books',
        method: 'POST',
        body: book,
      }),
      invalidatesTags: ['Book'],
    }),

    updateBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ( id ) => [
        { type: 'Book', id },
        'Book',
        'BorrowSummary',
      ],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book', 'BorrowSummary'],
    }),

    borrowBook: builder.mutation({
      query: (borrowData) => ({
        url: '/borrow',
        method: 'POST',
        body: borrowData,
      }),
      invalidatesTags: ['Book', 'BorrowRecord', 'BorrowSummary'],
    }),

    getBorrowSummary: builder.query({
      query: () => '/borrow',
      providesTags: ['BorrowSummary'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = api;
