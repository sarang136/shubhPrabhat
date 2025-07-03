import { createSlice } from "@reduxjs/toolkit";
import { postApi } from "./post";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("shopDetails")),
  },
  reducers: {
    logoutReporter: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      postApi.endpoints.verify.matchFulfilled,
      (state, { payload}) => {
        
        console.log("verifyOtp payload received:", payload);
        state.user = payload; 
        localStorage.setItem("shopDetails",JSON.stringify(payload))
      }
    );
  }
});

export const { logoutReporter } = authSlice.actions;
export default authSlice.reducer;
