"use client"
import React, { useEffect, useState, useCallback } from "react";
import { searchTasks } from "@/services/taskService";

const TaskSearchPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(query && { q: query }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate }),
      };
      const data = await searchTasks(params);
      setResults(data);
    } catch (error) {
      console.error("Error searching tasks:", error);
      setResults([]); // Fallback to an empty array on error
    } finally {
      setLoading(false);
    }
  }, [query, status, priority, dueDate]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Search & Filter Tasks</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-6">
        {/* Search Input with Icon Inside Border */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by title or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Due Date Filter */}
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {results.length > 0 ? (
          results.map((task: any) => (
            <div key={task._id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
              </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskSearchPage;
