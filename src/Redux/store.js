import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "../Redux/post.js";
import authSlice from "../Redux/appSlice.js";
import { newsApi } from "./newsAPI.js";
import categoriesApi from "./Categories.js";
import BlogsApi from "./BlogsApi.js";



export const store = configureStore({
    reducer: {
        [postApi.reducerPath]: postApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [BlogsApi.reducerPath]: BlogsApi.reducer,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postApi.middleware, newsApi.middleware, categoriesApi.middleware, BlogsApi.middleware),
})