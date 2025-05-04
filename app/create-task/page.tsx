"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "../../services/taskService";

export default function CreateTaskPage() {
  const router = useRouter();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low", // Match backend enum values
    status: "todo", // Match backend enum values
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!task.title.trim()) {
      setError("Title is required.");
      return false;
    }
    if (!task.dueDate) {
      setError("Due date is required.");
      return false;
    }
    if (!["low", "medium", "high"].includes(task.priority)) {
      setError("Invalid priority value.");
      return false;
    }
    if (!["todo", "in-progress", "done"].includes(task.status)) {
      setError("Invalid status value.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await createTask(task);
      if (res && res._id) { // Check if the response contains the created task's ID
        alert("Task created successfully!");
        router.push("/dashboard"); // Redirect to the dashboard after successful creation
      } else {
        setError("Failed to create the task. Please try again.");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("An error occurred while creating the task.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Task</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Task Title"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Task Description"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={task.priority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={task.status}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
