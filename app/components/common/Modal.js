import React from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {title && <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>}
        <div className="mb-6 text-gray-600">{children}</div>
        <div className="flex gap-3 justify-end">{actions}</div>
      </div>
    </div>
  );
}
