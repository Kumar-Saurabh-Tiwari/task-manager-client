'use client';  // Ensures this component works in the client-side rendering context

import { useState } from 'react';
import Link from "next/link";
import './globals.css';  // Import global styles
// export const metadata = {
//   title: "Task Manager",
//   description: "A simple task management app",
//   manifest: "/manifest.json",
//   themeColor: "#2563eb",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // State to handle sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-300">
            TaskManager
          </Link>

          {/* Desktop Navigation */}
          <div className="space-x-6 hidden md:flex">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
              Dashboard
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="text-blue-600 flex items-center md:hidden" 
            onClick={toggleSidebar}
          >
            <img
              src="https://cdn0.iconfinder.com/data/icons/rounded-basics/24/rounded__menu-512.png"
              alt="Menu icon"
              className="w-6 h-6"
            />
          </button>
        </nav>

        {/* Sidebar for mobile view */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeSidebar}>
            <div className="fixed top-0 left-0 w-64 bg-white h-full shadow-lg z-60 p-6">
              <button onClick={closeSidebar} className="text-gray-600 text-xl mb-4">X</button>
              <div className="space-y-4">
                <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                  Dashboard
                </Link>
                <Link href="/login" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                  Login
                </Link>
                <Link href="/register" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
