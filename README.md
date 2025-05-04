# Task Manager App

This is a **Task Manager App** built with [Next.js](https://nextjs.org). It allows users to create, manage, and track tasks with features like priority levels, statuses, and due dates. The app is designed to be user-friendly and efficient for task management.

## Features

- Create, update, and delete tasks.
- Assign priority levels (`low`, `medium`, `high`) to tasks.
- Track task statuses (`todo`, `in-progress`, `done`).
- View overdue tasks.
- User authentication for secure access.
- Responsive design for desktop and mobile devices.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kumar-Saurabh-Tiwari/task-manager-client.git
   cd task-manager-client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### Steps to Create a Task

1. Log in to your account or register if you are a new user.
2. Navigate to the **Dashboard**.
3. Click the **+ Add Task** button.
4. Fill in the task details:
   - **Title**: Enter a descriptive title for the task.
   - **Description**: Optionally, provide additional details about the task.
   - **Due Date**: Select a due date for the task.
   - **Priority**: Choose a priority level (`low`, `medium`, `high`).
   - **Status**: Set the initial status (`todo`, `in-progress`, `done`).
5. Click **Create Task** to save the task.

Your task will now appear in the task list on the dashboard.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
