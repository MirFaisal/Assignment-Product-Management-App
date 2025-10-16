"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  fetchProductById,
  updateProduct,
  clearSelectedProduct,
} from "@/app/store/slices/Product/productsSlice";
import { fetchCategories } from "@/app/store/slices/Category/categoriesSlice";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";
import Link from "next/link";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { hydrated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    images: [""],
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(clearSelectedProduct());

    if (hydrated) {
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
      if (slug) {
        dispatch(fetchProductById(slug));
      }
    }
  }, [dispatch, hydrated, slug]);

  // Populate form when product is loaded
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        categoryId: selectedProduct.category?.id || "",
        images: selectedProduct.images?.length > 0 ? selectedProduct.images : [""],
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    // Price validation
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price)) {
      errors.price = "Price must be a number";
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    // Category validation
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }

    // Images validation
    const validImages = formData.images.filter((img) => img.trim());
    if (validImages.length === 0) {
      errors.images = "At least one image URL is required";
    } else {
      // Validate URL format
      const urlPattern = /^https?:\/\/.+\..+/;
      const invalidImages = validImages.filter((img) => !urlPattern.test(img));
      if (invalidImages.length > 0) {
        errors.images = "Please enter valid image URLs (must start with http:// or https://)";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty image URLs
      const validImages = formData.images.filter((img) => img.trim());

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: validImages,
      };

      const result = await dispatch(
        updateProduct({
          id: selectedProduct.id,
          productData,
        }),
      ).unwrap();

      // Navigate to product detail page
      router.push(`/products/${result.slug}`);
    } catch (error) {
      setSubmitError(error || "Failed to update product");
      setIsSubmitting(false);
    }
  };

  // Show loading while auth is hydrating or fetching product
  if (!hydrated || (loading && !selectedProduct)) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if product fetch failed
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

  // Show not found if product doesn't exist
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
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/products/${slug}`} className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Product
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Submit Error */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Product Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.categoryId ? "border-red-500" : "border-gray-300"
                }`}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && <p className="mt-1 text-sm text-red-500">{formErrors.categoryId}</p>}
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Add image URLs for your product</p>

            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addImageField}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              + Add Another Image
            </button>

            {formErrors.images && <p className="mt-2 text-sm text-red-500">{formErrors.images}</p>}
          </div>

          {/* Image Preview */}
          {formData.images.some((img) => img.trim()) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images
                  .filter((img) => img.trim())
                  .map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Invalid URL</div>`;
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>
            <Link
              href={`/products/${slug}`}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProductPage;
