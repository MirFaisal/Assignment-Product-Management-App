"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/app/store/slices/Auth/authSlice";

import HamburgerIcon from "@/app/components/svgs/HamburgerIcon";
import LogoutIcon from "@/app/components/svgs/LogoutIcon";
import Link from "next/link";
import { menuItems } from "./data/menuItem";

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { email } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Mobile/Tablet Only */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle Menu">
        <HamburgerIcon open={isSidebarOpen} className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay - Mobile/Tablet Only */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[300px] bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        {/* Logo/Brand */}
        <div className="h-[100px] flex items-center justify-center px-6 border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">Product Manager</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-6 mt-10">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-100"
                    }`}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section at Bottom */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold uppercase">
              {email.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p>Administrator</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200">
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
