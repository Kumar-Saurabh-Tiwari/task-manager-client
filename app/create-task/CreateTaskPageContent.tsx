"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createTask } from "../../services/taskService";
import { scheduleNotification } from "../../services/notificationService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  [key: string]: any; // <-- allows dynamic keys
}
const initialTask: Task = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'low',
  status: 'todo',
  assignedTo: null,
};

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const assignId = searchParams.get("assignId"); // Safely extract `id` from query params
  const [task, setTask] = useState<Task>(initialTask);
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
    setLoading(true); // Disable button

    if (!validateForm()) {
      toast.error(error);
      setLoading(false);
      return;
    }

    if (!dayjs(task.dueDate).isValid()) {
      toast.error("Invalid due date.");
      setLoading(false);
      return;
    }

    const scheduledTime = dayjs(task.dueDate).utc().format("YYYY-MM-DDTHH:mm:ssZ");

    try {
      if (assignId) {
        task.assignedTo = assignId;
      }

      const res = await createTask(task);

      if (res && res._id) {
        toast.success("Task created successfully!");
        setTask(initialTask); // ✅ Reset form

        const notificationRes = await scheduleNotification({
          title: task.title,
          body: task.description || "You have a task due soon!",
          token: sessionStorage.getItem("fcmToken"),
          scheduledTime,
        });

        if (notificationRes.success) {
          toast.success("Notification scheduled successfully!");
        } else {
          toast.error("Failed to schedule notification.");
        }

        router.push("/dashboard");
      } else {
        setError("Failed to create the task. Please try again.");
        toast.error("Failed to create the task.");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("An error occurred while creating the task.");
      toast.error("An error occurred while creating the task.");
    } finally {
      setLoading(false); // Re-enable button
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
            Due Date & Time
          </label>
          <input
            type="datetime-local"
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
          disabled={loading}
          className={`w-full py-2 rounded transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

      </form>
    </div>
  );
}
