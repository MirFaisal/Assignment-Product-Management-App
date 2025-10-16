import { createAsyncThunk } from "@reduxjs/toolkit";
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
