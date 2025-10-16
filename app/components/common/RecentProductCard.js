import React from "react";
import Link from "next/link";

export default function RecentProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
      </div>
      <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
      <p className="text-blue-600 font-semibold text-sm">${product.price}</p>
      <p className="text-xs text-gray-500">{product.category?.name || "No category"}</p>
    </Link>
  );
}
