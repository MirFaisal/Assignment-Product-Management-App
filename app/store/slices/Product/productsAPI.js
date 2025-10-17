import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/app/services/api";

// Fetch products with pagination and category filter
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ offset = 0, limit = 12, categoryId = null }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      let endpoint = `/products?offset=${offset}&limit=${limit}`;
      if (categoryId) {
        endpoint += `&categoryId=${categoryId}`;
      }
      const response = await apiService.get(endpoint, token);
      return {
        products: response,
        offset,
        limit,
        hasMore: response.length === limit,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch single product by ID or slug
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (idOrSlug, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiService.get(`/products/${idOrSlug}`, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Search products by name
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchText, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiService.get(
        `/products/search?searchedText=${encodeURIComponent(searchText)}`,
        token,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiService.post("/products", productData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiService.put(`/products/${id}`, productData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      await apiService.delete(`/products/${id}`, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
