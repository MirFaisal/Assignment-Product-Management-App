import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Authenticate } from "./authAPI";

const initialState = {
  token: null,
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const userVerify = createAsyncThunk("auth/userVerify", async (email, { rejectWithValue }) => {
  try {
    const data = await Authenticate(email);
    return data;
  } catch (error) {
    return rejectWithValue(error.message || "Authentication failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userVerify.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(userVerify.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
