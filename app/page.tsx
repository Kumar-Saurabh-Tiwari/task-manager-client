"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { initializeFCM } from "../lib/fcmService";

export default function Home() {
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
  }, []);
  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center p-6 bg-white rounded-lg">
        <div className="flex justify-center">
          <img
            src="https://images.sftcdn.net/images/t_app-icon-m/p/9761faba-4932-11e8-9436-02420a000b15/1488207053/google-tasks-logo" // Replace with your icon path
            alt="Task Icon"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Welcome to Task Manager
        </h1>
        <p className="text-base text-gray-600 mt-2">
          Here you can create, manage, and track your tasks efficiently. Stay
          organized and boost your productivity with our easy-to-use task
          management system.
        </p>
        <Link href="/dashboard">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 mt-4">
            Manage Your Tasks
          </button>
        </Link>
      </div>
    </div>
  );
}