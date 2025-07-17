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
            query: ({ id, updatedFormData }) => ({
                url: `/admin/subcategories/${id}`,
                method: 'PUT',
                body: updatedFormData,
            }),
            invalidatesTags: ['post'],
        }),
        updateNewsStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/subcategories/status/${id}`,
                method: 'PUT',
                body: { status },
            }),
        }),

    }),
});



export const { useAddNewsMutation,
    useGetAllNewsQuery,
    useDeleteNewsMutation,
    useUpdateNewsMutation,
    useUpdateNewsStatusMutation,
} = newsApi;
