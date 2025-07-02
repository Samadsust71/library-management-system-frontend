import type { DBBook } from '@/types/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api'
  }),
  tagTypes: ['Book', 'BorrowRecord', 'BorrowSummary'],
  endpoints: (builder) => ({
    // Book endpoints
    getBooks: builder.query<DBBook[], void>({
      query: () => '/books',
      providesTags: ['Book'],
    }),
    getBook: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
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
      invalidatesTags: (result, error, { id }) => [
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
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation,useBorrowBookMutation
} = api;
