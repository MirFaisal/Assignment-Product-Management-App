import React from "react";
import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
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
            onClick={() => onDelete(product)}
            className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
