"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, searchCategories } from "@/app/store/slices/Category/categoriesAPI";
import { resetCategories } from "@/app/store/slices/Category/categoriesSlice";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";
import Header from "@/app/components/common/Header";
import SearchInput from "@/app/components/common/SearchInput";
import CategoryCard from "@/app/components/common/CategoryCard";
import LoadMoreButton from "@/app/components/common/LoadMoreButton";

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
    if (!hydrated) return; // Don't search if not hydrated

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
  }, [searchInput, hydrated]);

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
        <Header title="Categories" subtitle="Browse all product categories" />

        {/* Search */}
        <div className="mb-6 max-w-md">
          <SearchInput
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search categories by name..."
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
                  <CategoryCard key={category.id} category={category} />
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
