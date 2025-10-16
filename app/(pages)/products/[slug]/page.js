"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, deleteProduct } from "@/app/store/slices/Product/productsAPI";
import { clearSelectedProduct } from "@/app/store/slices/Product/productsSlice";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";
import Link from "next/link";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const { hydrated } = useSelector((state) => state.auth);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Clear previous product
    dispatch(clearSelectedProduct());

    // Wait for auth to hydrate before making API calls
    if (hydrated && slug) {
      dispatch(fetchProductById(slug));
    }
  }, [dispatch, hydrated, slug]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct.id));
      setShowDeleteModal(false);
      router.push("/products");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Show loading while auth is hydrating
  if (!hydrated || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">{error}</div>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Products
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Show not found
  if (!selectedProduct) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Product not found</p>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Products
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              {/* Additional Images */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {selectedProduct.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${selectedProduct.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>

              {/* Category Badge */}
              {selectedProduct.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {selectedProduct.category.image && (
                      <img
                        src={selectedProduct.category.image}
                        alt={selectedProduct.category.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    {selectedProduct.category.name}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">${selectedProduct.price}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProduct.description || "No description available"}
                </p>
              </div>

              {/* Product Details */}
              <div className="mb-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Product ID</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedProduct.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Slug</p>
                    <p className="text-sm font-medium text-gray-900">{selectedProduct.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedProduct.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/products/${selectedProduct.slug}/edit`}
                  className="flex-1 px-6 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Edit Product
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedProduct?.name}</span>?
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

export default ProductDetailPage;
