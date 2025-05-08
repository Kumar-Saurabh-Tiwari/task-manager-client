# Task Manager App

This is a **Task Manager App** built with [Next.js](https://nextjs.org). It allows users to create, manage, and track tasks with features like priority levels, statuses, and due dates. The app is designed to be user-friendly and efficient for task management.

---

## 🚀 Features

- Create, update, and delete tasks.
- Assign priority levels (`low`, `medium`, `high`) to tasks.
- Track task statuses (`todo`, `in-progress`, `done`).
- View upcoming and overdue tasks.
- Real-time updates via Socket.IO.
- Push notifications using Firebase Cloud Messaging.
- User authentication with JWT.
- Responsive design for desktop and mobile devices.

---

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

This project is designed as a scalable full-stack app with a clean separation between frontend (Next.js) and backend (Express.js).

- Uses REST API to manage tasks and authentication.
- Push notifications are scheduled via backend and sent with Firebase Cloud Messaging.
- Real-time task updates are implemented via Socket.IO.
- State and UI updates handled with React Hooks.
- Form submission is guarded against duplicates using a disabled button state.

---

## 🤔 Assumptions & Trade-offs

- JWTs are stored in `localStorage`, which is simple but less secure than using `httpOnly` cookies.
- Notifications only work if users grant browser permission.
- Basic role-based access is implemented via creator and assignee only; no advanced RBAC.
- Tasks are filtered and sorted by due date and `createdAt` using `dayjs`.
- Duplicate notifications prevented by avoiding redundant `showNotification` calls.

---

## 📋 Steps to Create a Task

1. Log in or register.
2. Navigate to **Dashboard**.
3. Click **+ Add Task**.
4. Fill in:
   - **Title**, **Description**, **Due Date**, **Priority**, **Status**
5. Click **Create Task**.
6. Form resets and button disables after submission to avoid duplicates.

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

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
