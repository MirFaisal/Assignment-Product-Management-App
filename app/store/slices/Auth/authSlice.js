import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Authenticate } from "./authAPI";

// Helper functions for localStorage
const getTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};
const getEmailFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_email");
  }
  return null;
};

const saveToStorage = (token, email) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_email", email);
  }
};

const clearStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
  }
};

// Initial state without localStorage (to avoid hydration errors)
const initialState = {
  token: null,
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  hydrated: false, // Track if we've loaded from localStorage
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
    hydrateAuth: (state) => {
      const token = getTokenFromStorage();
      const email = getEmailFromStorage();
      if (token) {
        state.token = token;
        state.email = email;
        state.isAuthenticated = true;
      }
      state.hydrated = true;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearStorage();
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
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.error = null;
        state.hydrated = true;
        saveToStorage(action.payload.token, action.payload.email);
      })
      .addCase(userVerify.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        clearStorage();
      });
  },
});

export const { hydrateAuth, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
