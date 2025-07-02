import type { Book } from '@/types/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://library-management-app-eta.vercel.app/api'
  }),
  tagTypes: ['Book', 'BorrowRecord', 'BorrowSummary'],
  endpoints: (builder) => ({
    // Book endpoints
    getBooks: builder.query<Book[], void>({
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
     updateBook: builder.mutation<Book, { id: string; data: Book }>({
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
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery, useCreateBookMutation, useUpdateBookMutation
} = api;
