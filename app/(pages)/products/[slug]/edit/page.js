"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, updateProduct } from "@/app/store/slices/Product/productsAPI";
import { clearSelectedProduct } from "@/app/store/slices/Product/productsSlice";
import { fetchCategories } from "@/app/store/slices/Category/categoriesAPI";
import ProductForm from "@/app/components/common/ProductForm";
import Link from "next/link";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { hydrated } = useSelector((state) => state.auth);

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
  // Prepare initial data for ProductForm
  const initialData = selectedProduct
    ? {
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        categoryId: selectedProduct.category?.id || "",
        images: selectedProduct.images?.length > 0 ? selectedProduct.images : [""],
      }
    : {
        name: "",
        description: "",
        price: "",
        categoryId: "",
        images: [""],
      };

  const handleUpdateProduct = async (productData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateProduct({
          id: selectedProduct.id,
          productData,
        }),
      ).unwrap();
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
          <ProductForm hydrated={false} />
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
        <div className="mb-6">
          <Link href={`/products/${slug}`} className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Product
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>
        <ProductForm
          initialData={initialData}
          categories={categories}
          hydrated={hydrated}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleUpdateProduct}
          submitLabel="Update Product"
          onCancel={() => router.push(`/products/${slug}`)}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditProductPage;
