'use client';

import { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook
import { useRouter } from "next/navigation";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth(); // Get authentication state
  const router = useRouter();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
    return null; // Prevent rendering until redirection is complete
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()} // Navigate to the previous page
              className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300"
            >
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/arrows/go-back-2.png"
                alt="Back"
                className="w-6 h-6 mr-2" // Adjusted size and spacing
              />
             
            </button>
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-300">
              TaskManager
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="space-x-6 hidden md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token"); // Clear token on logout
                    router.replace("/login"); // Redirect to login
                  }}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
                  Login
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
                  Register
                </Link>
              </>
            )}
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
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token"); // Clear token on logout
                        router.replace("/login"); // Redirect to login
                      }}
                      className="block text-gray-600 hover:text-blue-600 py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                      Login
                    </Link>
                    <Link href="/register" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                      Register
                    </Link>
                  </>
                )}
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
