'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import './globals.css';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { initializeFCM } from "../lib/fcmService";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Get authentication state
  const router = useRouter();

  useEffect(() => {
    // Call initializeFCM after 5 seconds, twice
    const firstCall = setTimeout(() => {
      initializeFCM();
    }, 5000);

    const secondCall = setTimeout(() => {
      initializeFCM();
    }, 10000); // 5 seconds after the first call

    // Cleanup timeouts when the component unmounts
    return () => {
      clearTimeout(firstCall);
      clearTimeout(secondCall);
    };
  }, [isAuthenticated]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    router.replace("/login"); // Redirect to login page
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster here */}
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300"
            >
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/arrows/go-back-2.png"
                alt="Back"
                className="w-6 h-6 mr-2"
              />
            </button>

            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-300">
              TaskManager
            </Link>

            {/* User Info */}
            {userEmail && (
              <div className="hidden sm:flex items-center space-x-2 ml-auto">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="User Icon"
                  className="w-6 h-6"
                />
                <span className="text-sm text-gray-700">{userEmail}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-10 hidden md:flex">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300">
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300"
                >
                  Logout
                </button>
                <Link href="/assign-task" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                  Assign Task
                </Link>
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
                <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                  Dashboard
                </Link>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="block text-gray-600 hover:text-blue-600 py-2"
                    >
                      Logout
                    </button>
                    <Link href="/assign-task" className="block text-gray-600 hover:text-blue-600 py-2" onClick={closeSidebar}>
                      Assign Task
                    </Link>

                    {/* Show email on mobile */}
                    {userEmail && (
                      <div className="flex items-center space-x-2 py-2 text-gray-700">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                          alt="User Icon"
                          className="w-5 h-5"
                        />
                        <span className="text-sm">{userEmail}</span>
                      </div>
                    )}
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
