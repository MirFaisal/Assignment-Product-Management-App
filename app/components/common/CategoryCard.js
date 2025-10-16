import React from "react";
import CategoryIcon from "@/app/components/svgs/CategoryIcon";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-40 bg-gray-200">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <CategoryIcon />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        {category.description && <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>}
        <p className="text-xs text-gray-500 mt-2">
          Created: {new Date(category.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
