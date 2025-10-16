import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/app/services/api";

/**
 * Async thunk to fetch all categories
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await apiService.get("/categories", token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Async thunk to fetch single category by ID
 */
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await apiService.get(`/categories/${id}`, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })

      // Fetch Category By ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch category";
      });
  },
});

export const { clearSelectedCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
