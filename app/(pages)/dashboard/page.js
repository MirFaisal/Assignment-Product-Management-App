"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/app/components/Layouts/DashboardLayout";
import DashboardHeader from "@/app/components/common/DashboardHeader";
import StatsCard from "@/app/components/common/StatsCard";
import RecentProductCard from "@/app/components/common/RecentProductCard";
import ProductIcon from "@/app/components/svgs/ProductIcon";
import CategoryIcon from "@/app/components/svgs/CategoryIcon";
import PriceIcon from "@/app/components/svgs/PriceIcon";
import StatusIcon from "@/app/components/svgs/StatusIcon";
import DistributionIcon from "@/app/components/svgs/DistributionIcon";
import AddProductIcon from "@/app/components/svgs/AddProductIcon";
import AllProductsIcon from "@/app/components/svgs/AllProductsIcon";
import CategoriesIcon from "@/app/components/svgs/CategoriesIcon";
import SettingsIcon from "@/app/components/svgs/SettingsIcon";
import EmptyProductIcon from "@/app/components/svgs/EmptyProductIcon";
import PlusIcon from "@/app/components/svgs/PlusIcon";
import { fetchProducts } from "@/app/store/slices/Product/productsAPI";
import { fetchCategories } from "@/app/store/slices/Category/categoriesAPI";
import Link from "next/link";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { email, hydrated } = useSelector((state) => state.auth);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (hydrated) {
      dispatch(fetchProducts({ offset: 0, limit: 1000 }));
      dispatch(fetchCategories({ offset: 0, limit: 50 }));
    }
  }, [dispatch, hydrated]);

  const dashboardStats = useMemo(() => {
    const categoryStats = categories.reduce((acc, category) => {
      const productCount = products.filter((p) => p.category?.id === category.id).length;
      acc[category.name] = productCount;
      return acc;
    }, {});

    const avgPrice =
      products.length > 0 ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length : 0;

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      avgPrice: avgPrice.toFixed(2),
      categoryStats,
      recentProducts,
      topCategories,
    };
  }, [products, categories]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <DashboardHeader email={email} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={productsLoading ? "..." : dashboardStats.totalProducts}
            color="blue"
            note="↗ 12% from last month"
            icon={<ProductIcon />}
          />
          <StatsCard
            title="Categories"
            value={categoriesLoading ? "..." : dashboardStats.totalCategories}
            color="green"
            note="↗ 5% growth"
            icon={<CategoryIcon />}
          />
          <StatsCard
            title="Avg. Price"
            value={`$${productsLoading ? "..." : dashboardStats.avgPrice}`}
            color="purple"
            note="↘ 3% decrease"
            icon={<PriceIcon />}
          />
          <StatsCard
            title="System Status"
            value={<span className="text-2xl font-bold text-orange-900 mt-1">Healthy</span>}
            color="orange"
            note="All systems operational"
            icon={<StatusIcon />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
              <Link href="/categories" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {dashboardStats.topCategories.length > 0 ? (
                dashboardStats.topCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-600 truncate">{category}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div
                        className={`h-3 rounded-full ${
                          index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{
                          width: `${Math.max(
                            (count / Math.max(...dashboardStats.topCategories.map(([, c]) => c))) * 100,
                            10,
                          )}%`,
                        }}></div>
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DistributionIcon />
                  <p>No data available</p>
                  <p className="text-xs mt-1">Add some products to see distribution</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/products/create"
                className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <div className="bg-blue-500 text-white rounded-lg p-2 group-hover:bg-blue-600">
                  <AddProductIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Product</p>
                  <p className="text-xs text-gray-600">Create a new product</p>
                </div>
              </Link>

              <Link
                href="/products"
                className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <div className="bg-green-500 text-white rounded-lg p-2 group-hover:bg-green-600">
                  <AllProductsIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">All Products</p>
                  <p className="text-xs text-gray-600">Browse inventory</p>
                </div>
              </Link>

              <Link
                href="/categories"
                className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                <div className="bg-purple-500 text-white rounded-lg p-2 group-hover:bg-purple-600">
                  <CategoriesIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Categories</p>
                  <p className="text-xs text-gray-600">Manage categories</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>

          {dashboardStats.recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {dashboardStats.recentProducts.map((product) => (
                <RecentProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <EmptyProductIcon />
              <p className="text-lg font-medium mb-2">No products yet</p>
              <p className="mb-4">Get started by adding your first product</p>
              <Link
                href="/products/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon />
                Add Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
