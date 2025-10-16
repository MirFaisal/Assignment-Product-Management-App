"use client";

import Sidebar from "./Sidebar";
import ProtectedRoute from "../utils/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-[350px]">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
