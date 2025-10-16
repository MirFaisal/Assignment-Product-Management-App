import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/app/services/api";

/**
 * Async thunk to fetch categories with pagination
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ offset = 0, limit = 50 } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      // Build query parameters
      let endpoint = `/categories?offset=${offset}&limit=${limit}`;

      const response = await apiService.get(endpoint, token);
      return {
        categories: response,
        offset,
        limit,
        hasMore: response.length === limit,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Async thunk to search categories by name
 */
export const searchCategories = createAsyncThunk(
  "categories/searchCategories",
  async (searchText, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await apiService.get(
        `/categories/search?searchedText=${encodeURIComponent(searchText)}`,
        token,
      );
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
  pagination: {
    offset: 0,
    limit: 50,
    hasMore: true,
  },
  searchQuery: "",
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetCategories: (state) => {
      state.categories = [];
      state.pagination.offset = 0;
      state.pagination.hasMore = true;
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
        const { categories, offset, hasMore } = action.payload;

        // If offset is 0, replace categories. Otherwise, append for pagination
        if (offset === 0) {
          state.categories = categories;
        } else {
          state.categories = [...state.categories, ...categories];
        }

        state.pagination.offset = offset;
        state.pagination.hasMore = hasMore;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })

      // Search Categories
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.pagination.hasMore = false; // Search results don't support pagination
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search categories";
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

export const { clearSelectedCategory, setSearchQuery, resetCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
