"use client";

import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/store/slices/Product/productsAPI";
import { fetchCategories } from "@/app/store/slices/Category/categoriesAPI";
import ProductForm from "@/app/components/common/ProductForm";
import Link from "next/link";
import LoadingSpinner from "@/app/components/svgs/LoadingSpinner";

const CreateProductPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { categories } = useSelector((state) => state.categories);
  const { hydrated } = useSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (hydrated) {
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
    }
  }, [dispatch, hydrated]);

  const handleCreateProduct = async (productData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await dispatch(createProduct(productData)).unwrap();
      router.push(`/products/${result.slug}`);
    } catch (error) {
      setSubmitError(error || "Failed to create product");
      setIsSubmitting(false);
    }
  };


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
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
        </div>

        <ProductForm
          initialData={{ name: "", description: "", price: "", categoryId: "", images: [""] }}
          categories={categories}
          hydrated={hydrated}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleCreateProduct}
          submitLabel="Create Product"
          onCancel={() => router.push("/products")}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateProductPage;
