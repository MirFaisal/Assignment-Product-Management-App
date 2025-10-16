import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/app/services/api";

/**
 * Async thunk to fetch products with pagination and category filter
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ offset = 0, limit = 10, categoryId = null }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      // Build query parameters
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

/**
 * Async thunk to fetch single product by ID
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await apiService.get(`/products/${id}`, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Async thunk to create a new product
 */
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

/**
 * Async thunk to update a product
 */
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

/**
 * Async thunk to delete a product
 */
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

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    offset: 0,
    limit: 10,
    hasMore: true,
  },
  filters: {
    categoryId: null,
    searchQuery: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.pagination.offset = 0;
      state.pagination.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { products, offset, hasMore } = action.payload;

        // If offset is 0, replace products. Otherwise, append for pagination
        if (offset === 0) {
          state.products = products;
        } else {
          state.products = [...state.products, ...products];
        }

        state.pagination.offset = offset;
        state.pagination.hasMore = hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { setSearchQuery, setCategoryFilter, clearSelectedProduct, resetProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
