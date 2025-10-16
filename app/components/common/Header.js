import React from "react";

export default function Header({ title, subtitle, children }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
