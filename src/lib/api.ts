import type { Book } from '@/types/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Book', 'BorrowRecord', 'BorrowSummary'],
  endpoints: (builder) => ({
    // Book endpoints
    getBooks: builder.query<Book[], void>({
      query: () => '/books',
      providesTags: ['Book'],
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    })
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery
} = api;
