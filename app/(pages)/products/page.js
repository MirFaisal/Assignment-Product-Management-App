"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import Modal from "@/app/components/common/Modal";
import ProductCard from "@/app/components/common/ProductCard";
import Header from "@/app/components/common/Header";
import SearchInput from "@/app/components/common/SearchInput";
import LoadMoreButton from "@/app/components/common/LoadMoreButton";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProducts, searchProducts, deleteProduct } from "@/app/store/slices/Product/productsAPI";
import { setCategoryFilter, resetProducts } from "@/app/store/slices/Product/productsSlice";
import { fetchCategories } from "@/app/store/slices/Category/categoriesAPI";
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
        <Header title="Products">
          <Link
            href="/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Product
          </Link>
        </Header>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <SearchInput value={searchInput} onChange={handleSearch} placeholder="Search products by name..." />

          {/* Category Filter */}
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
                  <ProductCard key={product.id} product={product} onDelete={handleDeleteClick} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {pagination.hasMore && !searchInput.trim() && (
              <div className="flex justify-center mt-8">
                <LoadMoreButton onClick={handleLoadMore} loading={loading} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        title="Confirm Delete"
        onClose={cancelDelete}
        actions={[
          <button
            key="cancel"
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>,
          <button
            key="delete"
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete
          </button>,
        ]}>
        Are you sure you want to delete <span className="font-semibold">{productToDelete?.name}</span>?<br />
        This action cannot be undone.
      </Modal>
    </DashboardLayout>
  );
};

export default ProductsPage;
