import React from "react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
