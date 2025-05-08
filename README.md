# Task Manager App

This is a **Progressive Web App (PWA)** built with [Next.js](https://nextjs.org) for managing tasks efficiently. It allows users to create, update, and track tasks with features like priority levels, statuses, and due dates. The app leverages **Service Workers** for offline support and background push notifications, making it highly responsive and mobile-friendly.

---

## 🚀 Features

- Create, update, and delete tasks.
- Assign priority levels (`low`, `medium`, `high`) to tasks.
- Track task statuses (`todo`, `in-progress`, `done`).
- View upcoming and overdue tasks.
- Real-time updates via Socket.IO.
- Push notifications using Firebase Cloud Messaging and Service Workers.
- User authentication with JWT.
- Responsive design for desktop and mobile devices.

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/Kumar-Saurabh-Tiwari/task-manager-client.git
cd task-manager-client
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

Ensure Firebase credentials are correct and `firebase-messaging-sw.js` is placed inside the `public/` directory.

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧠 Approach Explanation

This project is architected as a scalable full-stack application with a clean separation between the frontend and backend:

- **Frontend**: Built using **Next.js**, leveraging server-side rendering and React Hooks for a fast and interactive UI.
- **Backend**: Powered by **Express.js**, connected to a **MongoDB Atlas** instance hosted on AWS for scalable and reliable data storage.
- **RESTful APIs**: Handle task management and user authentication in a structured and reusable manner.
- **Firebase Cloud Messaging (FCM)**: Used for push notifications, scheduled from the backend to alert users about upcoming tasks.
- **Socket.IO**: Enables real-time communication for task updates, ensuring users see changes without refreshing.
- **Form Handling**: Uses React state to control form inputs and disable the submit button after submission to prevent duplicate entries.


## 🤔 Assumptions & Trade-offs

- JWTs are stored in `localStorage`, which is simple but less secure than using `httpOnly` cookies.
- Notifications only work if users grant browser permission.
- Basic role-based access is implemented via creator and assignee only; no advanced RBAC.
- Tasks are filtered and sorted by due date and `createdAt` using `dayjs`.
- Duplicate notifications prevented by avoiding redundant `showNotification` calls.

---

## 📋 Steps to Create a Task

### ✅ For Your Own Tasks

1. **Log in** to your account or **register** if you're a new user.
2. Navigate to the **Dashboard**.
3. Click the **+ Add Task** button.
4. Fill in the task details:
   - **Title**: A brief name for the task.
   - **Description** *(optional)*: Additional information or context.
   - **Due Date**: Set the deadline (date & time).
   - **Priority**: Choose one of `low`, `medium`, or `high`.
   - **Status**: Select the current status (`todo`, `in-progress`, `done`).
5. Click **Create Task**.
6. The form will **reset** and the **submit button will disable temporarily** to prevent duplicate submissions.

### 👥 To Assign a Task to Another User

1. In the **header**, click on **Assign Task**.
2. Fill in the task details similar to above:
   - **Title**
   - **Description**
   - **Due Date**
   - **Priority**
   - **Status**
3. Click **Create Task**.
4. The task will be assigned to the selected user and appear in their dashboard.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repo](https://github.com/vercel/next.js)

---

## 🚀 Deploy on Vercel

Easily deploy with [Vercel](https://vercel.com/new) — creators of Next.js.

- Guide: [Deploying Next.js Apps](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🚀 Backend Deployment on Render

The backend server is deployed on [Render](https://render.com), a modern cloud platform for hosting web applications and APIs.

### 🛠 Deployment Setup

1. **MongoDB Atlas (AWS-hosted)**
   - A MongoDB cluster is hosted on MongoDB Atlas, utilizing AWS as the cloud provider.
   - Connection string (`MONGODB_URI`) is securely stored in environment variables.

2. **Render Configuration**
   - Create a new Web Service on Render.
   - Connect your GitHub repository or upload your code.
   - Set the build and start commands:
     ```bash
     Build Command: npm install
     Start Command: npm start
     ```
   - Add the following **Environment Variables** in Render:
     - `MONGODB_URI`: your MongoDB Atlas connection string
     - `JWT_SECRET`: secret key used for authentication
     - Any other necessary env vars like `PORT`, `FIREBASE_SERVER_KEY`, etc.

3. **Automatic Deployments**
   - Enable auto-deploy from GitHub to automatically redeploy when changes are pushed.

4. **Server Access**
   - Once deployed, your backend will be accessible via the Render-generated URL (e.g., `https://task-manager-backend.onrender.com`).


## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
