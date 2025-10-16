import React from "react";

export default function DashboardHeader({ email }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {email || "User"}! Here's your overview.</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Online
          </div>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
