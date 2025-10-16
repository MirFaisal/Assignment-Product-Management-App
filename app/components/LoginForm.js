"use client";

import { useDispatch, useSelector } from "react-redux";
import { userVerify, logout, clearError } from "@/app/store/slices/Auth/authSlice";
import { useState } from "react";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, email, token } = useSelector((state) => state.auth);
  const [emailInput, setEmailInput] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailInput) return;

    // Dispatch the async thunk with email
    const result = await dispatch(userVerify(emailInput));

    // Check if successful
    if (userVerify.fulfilled.match(result)) {
      console.log("Login successful!", result.payload);
      setEmailInput(""); // Clear input
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Logged In</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p className="break-all">
              <strong>Token:</strong> {token?.substring(0, 30)}...
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start justify-between">
            <span className="text-sm">{error}</span>
            <button type="button" onClick={handleClearError} className="text-red-700 hover:text-red-900 ml-2">
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !emailInput}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> This uses Redux Toolkit async thunk for authentication.
        </p>
      </div>
    </div>
  );
}
