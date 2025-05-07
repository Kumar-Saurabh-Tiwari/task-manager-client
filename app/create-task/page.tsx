"use client";

import { Suspense } from "react";
import CreateTaskPageContent from "./CreateTaskPageContent";

const CreateTaskPage = () => {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-80 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CreateTaskPageContent />
    </Suspense>
  );
};

export default CreateTaskPage;