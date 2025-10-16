import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth/authSlice";
import productsReducer from "./slices/Product/productsSlice";
import categoriesReducer from "./slices/Category/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
