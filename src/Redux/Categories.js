import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // use /react here!

const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  }),
  tagTypes: ['post'],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "admin/categories/getall",
      }),
      providesTags: ["post"],
    }),

    getAllSubCategories: builder.query({
      query: (id) => ({
        url: `/admin/subcategories/service/${id}`,
      }),
      providesTags: ["post"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
} = categoriesApi;

export default categoriesApi;
