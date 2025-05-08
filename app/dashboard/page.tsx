"use client";

import { useEffect, useState } from "react";
import { format, isBefore } from "date-fns";
import { getTasks } from "../../services/taskService";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { scheduleNotification } from "../../services/notificationService";
import socket from '../../lib/socket'; // Adjust the import path as necessary
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // Ensure tasks is initialized as an empty array

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: { id: string } = jwtDecode(token);
        setCurrentUserId(decodedToken.id);
      } catch (error) {
        console.error('Invalid token or failed to decode:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return; // Wait until currentUserId is available

    console.log('Current User ID:', currentUserId);

    socket.on('receive-task-update', async (task) => {
      console.log('🔔 New task received via socket:', task);
      sessionStorage.removeItem('scheduleCalled');
      if (task.assignedTo === currentUserId) {
        console.log('Task assigned to current user:', task);
        setLoading(true);
        try {
          const data = await getTasks();
          setTasks(Array.isArray(data) ? data : []); // Ensure data is an array
          scheduleUpcomingNotifications(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTasks([]); // Fallback to an empty array on error
        } finally {
          setLoading(false); // Hide spinner
        }
      }
    });

    return () => {
      socket.off('receive-task-update');
    };
  }, [currentUserId]); // ✅ Now it depends on currentUserId



  const sendTaskUpdate = () => {
    socket.emit('send-task-update', 'task');
  };


  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchTasks() {
      setLoading(true);
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : []); // Ensure data is an array
        scheduleUpcomingNotifications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Fallback to an empty array on error
      } finally {
        setLoading(false); // Hide spinner
      }
    }
    fetchTasks();
  }, [isAuthenticated, currentUserId]);

  const scheduleUpcomingNotifications = async (tasks: any) => {
    const token = sessionStorage.getItem("fcmToken");
    // ✅ Check if notifications already scheduled
    const alreadyScheduled = sessionStorage.getItem("scheduleCalled");
    if (alreadyScheduled || !token) return;

    for (const task of tasks) {
      const scheduledDueTime = new Date(task.dueDate);
      const currentTime = new Date();

      // Check if the scheduled time is in the future
      if (scheduledDueTime > currentTime) {
        const scheduledTime = dayjs(task.dueDate).utc().format("YYYY-MM-DDTHH:mm:ssZ");
        await scheduleNotification({
          title: task.title,
          body: task.description || "You have a task due soon!",
          token,
          scheduledTime,
        });
      } else {
        console.log("Skipping notification for expired task:", task.title, "due at", scheduledDueTime);
      }
    }


    // ✅ Set flag so it's not called again in this session
    sessionStorage.setItem("scheduleCalled", "true");
  };


  const tasksAssigned = tasks
    .filter((t: any) => {
      const createdById = t.createdBy?._id || t.createdBy;
      const assignedToId = t.assignedTo?._id || t.assignedTo;

      const isOwner = createdById === currentUserId || assignedToId === currentUserId;
      const isUpcoming = new Date(t.dueDate) > new Date();

      return isOwner && isUpcoming;
    })
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const overdueTasks = tasks
    .filter((t: any) => new Date(t.dueDate) < new Date())
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-80 backdrop-blur-sm z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
              <path d="M10 2a8 8 0 105.29 14.71l4 4a1 1 0 001.42-1.42l-4-4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            <span className="text-sm font-medium">Search</span>
          </Link>

          {/* Add Task Button */}
          <Link
            href="/create-task"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + Add Task
          </Link>
        </div>
      </div>

      <Section title="📝 Tasks For You" tasks={tasksAssigned} />
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
