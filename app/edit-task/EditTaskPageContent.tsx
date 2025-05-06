"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getTaskById,
  updateTask,
  deleteTask,
} from "../../services/taskService";
import { toast } from "react-hot-toast";
import { scheduleNotification } from "../../services/notificationService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const EditTaskPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null); // State to store the `id` safely

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const taskId = searchParams.get("id"); // Safely extract `id` from query params
      if (!taskId) {
        toast.error("Task ID is missing");
        router.push("/dashboard"); // Redirect to dashboard if no ID is provided
        return;
      }
      setId(taskId); // Set the `id` in state
    } catch (error) {
      console.error("Error extracting task ID:", error);
      toast.error("An error occurred while extracting the task ID");
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!id) return; // Wait until `id` is set

    const fetchTask = async () => {
      try {
        const data = await getTaskById(id);
        if (data?._id) {
          setTask({
            title: data.title,
            description: data.description,
            dueDate: dayjs(data.dueDate).format("YYYY-MM-DDTHH:mm"), // Format for datetime-local input
            priority: data.priority,
          });
        } else {
          toast.error("Failed to fetch task");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("An error occurred while fetching the task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduledTime = dayjs(task.dueDate).utc().format("YYYY-MM-DDTHH:mm:ssZ");
      const updated = await updateTask(id!, { ...task, dueDate: task.dueDate });
      if (updated?._id) {
        const notificationRes = await scheduleNotification({
          title: task.title,
          body: task.description || "You have a task due soon!",
          token: sessionStorage.getItem("fcmToken"),
          scheduledTime,
        });
        toast.success("Task updated successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("An error occurred while updating the task");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteTask(id!);
      if (res?.message === "Task deleted") {
        toast.success("Task deleted successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("An error occurred while deleting the task");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-80 backdrop-blur-sm z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-4 shadow rounded bg-white mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Task
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskPageContent;
