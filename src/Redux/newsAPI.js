import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    }),
    tagTypes: ['post'],
    endpoints: (builder) => ({
        addNews: builder.mutation({
            query: (formData) => ({
                url: '/admin/subcategories/createProductByReporter',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['post'],
        }),

        getAllNews: builder.query({
            query: (id) => ({
                url: `/admin/subcategories/getByreporter/${id}`
            }),
            providesTags: ["post"],
        }),

        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/admin/subcategories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["post"],
        }),

        updateNews: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/admin/subcategories/${id}`,
                method: 'PUT',
                body: updatedData,
            }),
            invalidatesTags: ['post'],
        }),
    }),
});



export const {useAddNewsMutation,
    useGetAllNewsQuery,
    useDeleteNewsMutation,
    useUpdateNewsMutation,
} = newsApi;
