"use client";

import { useEffect, useState } from "react";
import { format, isBefore } from "date-fns";
import { getTasks } from "../../services/taskService";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

type Task = {
  _id: string; // Updated to match the backend response
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true); // Loading state

  const [tasks, setTasks] = useState<Task[]>([]); // Ensure tasks is initialized as an empty array
  const currentUserId = "681751441feda357ed8eb4d0"; // Replace with real user ID

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchTasks() {
      setLoading(true);
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Fallback to an empty array on error
      } finally {
        setLoading(false); // Hide spinner
      }
    }
    fetchTasks();
  }, [isAuthenticated]);

  const tasksAssigned = tasks.filter((t) => t.createdBy._id === currentUserId);
  const overdueTasks = tasks.filter((t) => isBefore(new Date(t.dueDate), new Date()));

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-80 backdrop-blur-sm z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <Link
            href="/search-task"
            className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2"
            aria-label="Search Tasks"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                d="M10 2a8 8 0 105.29 14.71l4 4a1 1 0 001.42-1.42l-4-4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
              />
            </svg>
            <span className="text-sm font-medium">Search</span>
          </Link>

          {/* Add Task Button */}
          <Link
            href="/create-task"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Task
          </Link>
        </div>
      </div>
      <Section title="📝 Tasks You Created" tasks={tasksAssigned} />
      <Section title="⏰ Overdue Tasks" tasks={overdueTasks} highlight="red" />
    </div>
  );
}

function Section({ title, tasks, highlight }: { title: string; tasks: Task[]; highlight?: string }) {
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${highlight === "red" ? "text-red-600" : ""}`}>
        {title}
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 italic">No tasks found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Due: {format(new Date(task.dueDate), "dd MMM yyyy")}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Created By: {task.createdBy.name} ({task.createdBy.email})
              </p>
              <div className="flex gap-2 text-sm mb-4">
                <Badge color={getPriorityColor(task.priority)}>{task.priority}</Badge>
                <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
              </div>
              <div className="flex justify-between">
                <Link
                  href={`/edit-task?id=${task._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Task
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${color}`}>
      {children}
    </span>
  );
}

function getPriorityColor(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
}

function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "done":
      return "bg-green-100 text-green-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
