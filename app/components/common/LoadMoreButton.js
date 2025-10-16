import React from "react";

export default function LoadMoreButton({ onClick, loading, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors flex items-center gap-2">
      {loading ? (
        <>
          {/* You can pass a spinner as children or use a default one */}
          {children || "Loading..."}
        </>
      ) : (
        children || "Load More"
      )}
    </button>
  );
}
