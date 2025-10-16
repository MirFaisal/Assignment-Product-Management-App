"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  searchCategories,
  resetCategories,
} from "@/app/store/slices/Category/categoriesSlice";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";
import Link from "next/link";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, pagination } = useSelector((state) => state.categories);
  const { hydrated } = useSelector((state) => state.auth);

  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    // Wait for auth to hydrate before making API calls
    if (hydrated) {
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
    }
  }, [dispatch, hydrated]);

  // Debounced search - call API after user stops typing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchInput.trim()) {
      const timeout = setTimeout(() => {
        dispatch(searchCategories(searchInput.trim()));
      }, 500); // Wait 500ms after user stops typing
      setSearchTimeout(timeout);
    } else {
      // If search is cleared, reload categories
      dispatch(resetCategories());
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchInput]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleLoadMore = () => {
    const newOffset = pagination.offset + pagination.limit;
    dispatch(
      fetchCategories({
        offset: newOffset,
        limit: pagination.limit,
      }),
    );
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
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Categories</h1>
            <p className="text-gray-600 mt-1">Browse all product categories</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
        )}

        {/* Loading State */}
        {loading && categories.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {searchInput.trim()
                    ? "No categories found matching your search."
                    : "No categories available."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?categoryId=${category.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                    {/* Category Image */}
                    <div className="relative h-40 bg-gray-200">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
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

        {/* Category Stats */}
        {categories.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing {categories.length} {categories.length === 1 ? "category" : "categories"}
              {searchInput.trim() && ` for "${searchInput}"`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
