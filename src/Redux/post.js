import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  }),
  tagTypes: ["post"],
  endpoints: (builder) => ({

    addPost: builder.mutation({
      query: (post) => ({
        url: '/reporter/auth/login',
        method: 'POST',
        body: post,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ["post"],
    }),

    register: builder.mutation({
      query: (register) => ({
        url: '/reporter/auth/register',
        method: 'POST',
        body: register,
      }),
      invalidatesTags: ['post'],
    }),

    verify: builder.mutation({
      query: (verify) => ({
        url: '/reporter/auth/verify-otp',
        method: 'POST',
        body: verify,
      }),
      invalidatesTags: ["post"],
    }),

    logout: builder.mutation({
      query: (body) => ({
        url: '/reporter/auth/logout',
        method: 'POST',
        body,
      }),
    }),

    updateReporterProfile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/reporter/auth/updateProfile/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),

    getReporter: builder.query({
      query: (id) => ({
        url: `/reporter/auth/${id}`,
        method: 'GET',
      }),
      providesTags: ["post"],
      
    })


  }),
});

export const {
  useAddPostMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useUpdateReporterProfileMutation,
  useGetReporterQuery,
} = postApi;
