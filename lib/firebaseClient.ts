import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAmb4fLYmprx5SsPf5hObmRM6gIbhOFCOA",
  authDomain: "task-app-bb207.firebaseapp.com",
  projectId: "task-app-bb207",
  storageBucket: "task-app-bb207.appspot.com",
  messagingSenderId: "586634210747",
  appId: "1:586634210747:web:37197156474a471d83a89e",
  measurementId: "G-PBDY90MM3V",
};

// Initialize Firebase
let messaging:any;
if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestFCMToken = async (vapidKey: string): Promise<string | null> => {
  try {
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      return token;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving FCM token:", error);
    return null;
  }
};
