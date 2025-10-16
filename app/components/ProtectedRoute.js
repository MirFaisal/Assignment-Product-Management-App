"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading, hydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect after hydration is complete
    if (hydrated && !loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, hydrated, router]);

  // Show loading state while hydrating or checking authentication
  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
