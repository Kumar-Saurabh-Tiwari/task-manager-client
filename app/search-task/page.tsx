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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {results.length > 0 ? (
          results.map((task:any) => (
            <div key={task._id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
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
