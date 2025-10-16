"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "@/app/store/slices/Auth/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage on client mount
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
}
