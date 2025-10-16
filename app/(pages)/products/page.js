"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchProducts,
  searchProducts,
  deleteProduct,
  setCategoryFilter,
  resetProducts,
} from "@/app/store/slices/Product/productsSlice";
import { fetchCategories } from "@/app/store/slices/Category/categoriesSlice";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";
import Link from "next/link";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryIdFromUrl = searchParams.get("categoryId");

  const { products, loading, error, pagination, filters } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { hydrated } = useSelector((state) => state.auth);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isChangingCategory, setIsChangingCategory] = useState(false);

  // Load categories once when component mounts
  useEffect(() => {
    if (hydrated) {
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
    }
  }, [dispatch, hydrated]);

  // Load products when URL category changes
  useEffect(() => {
    if (hydrated) {
      const categoryId = categoryIdFromUrl;

      // Set category filter from URL
      dispatch(setCategoryFilter(categoryId));
      dispatch(resetProducts());
      dispatch(fetchProducts({ offset: 0, limit: 10, categoryId }));
      setIsChangingCategory(false);
    }
  }, [dispatch, hydrated, categoryIdFromUrl]);

  // Debounced search - call API after user stops typing
  useEffect(() => {
    if (!hydrated) return; // Don't search if not hydrated

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchInput.trim()) {
      const timeout = setTimeout(() => {
        dispatch(searchProducts(searchInput.trim()));
      }, 500); // Wait 500ms after user stops typing
      setSearchTimeout(timeout);
    } else {
      // If search is cleared, reload products
      dispatch(resetProducts());
      const categoryId = categoryIdFromUrl;
      dispatch(fetchProducts({ offset: 0, limit: 10, categoryId }));
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchInput, hydrated]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value || null;
    setIsChangingCategory(true);
    setSearchInput(""); // Clear search when changing category

    // Update the URL search params - this will trigger the useEffect above
    const params = new URLSearchParams(window.location.search);
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    router.replace(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleLoadMore = () => {
    const newOffset = pagination.offset + pagination.limit;
    const categoryId = categoryIdFromUrl;
    dispatch(
      fetchProducts({
        offset: newOffset,
        limit: pagination.limit,
        categoryId,
      }),
    );
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Show loading while auth is hydrating
  if (!hydrated) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
          <Link
            href="/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryIdFromUrl || ""}
              onChange={handleCategoryChange}
              disabled={isChangingCategory}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
        )}

        {/* Loading State */}
        {(loading && products.length === 0) || isChangingCategory ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {searchInput.trim() ? "No products found matching your search." : "No products available."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-blue-600">${product.price}</span>
                        {product.category && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {product.category.name}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 px-3 py-2 text-sm text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                          View
                        </Link>
                        <Link
                          href={`/products/${product.slug}/edit`}
                          className="flex-1 px-3 py-2 text-sm text-center bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {pagination.hasMore && !searchInput.trim() && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors flex items-center gap-2">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{productToDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;
