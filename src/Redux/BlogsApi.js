import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BlogsApi = createApi({
  reducerPath: "BlogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    addBlogs: builder.mutation({
      query: (formData) => ({
        url: "/admin/offer/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    getPendingBlogs: builder.query({
      query: (id) => `/admin/offer/pending/${id}`,
      providesTags: ["Blog"],
    }),

    getRejectedBlogs: builder.query({
      query: (id) => `/admin/offer/rejected/${id}`,
      providesTags: ["Blog"],
    }),

    getApprovedBlogs: builder.query({
      query: (id) => `/admin/offer/approved/${id}`,
      providesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/offer/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admin/offer/update/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useAddBlogsMutation,
  useDeleteBlogMutation,
  useGetApprovedBlogsQuery,
  useGetPendingBlogsQuery,
  useGetRejectedBlogsQuery,
  useUpdateBlogMutation,
} = BlogsApi;

export default BlogsApi;
