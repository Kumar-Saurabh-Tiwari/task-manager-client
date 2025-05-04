import { requestFCMToken } from "./firebaseClient";

export const initializeFCM = async (): Promise<void> => {
  if (typeof window === "undefined") {
    // Ensure this code only runs on the client side
    console.warn("initializeFCM called on the server. Skipping FCM initialization.");
    return;
  }

  try {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY; // Ensure this is set in your environment variables
    if (!vapidKey) {
      console.error("VAPID key is not set in environment variables.");
      return;
    }

    const fcmToken = await requestFCMToken(vapidKey);
    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      sessionStorage.setItem("fcmToken", fcmToken); // Store the token in session storage
    } else {
      console.warn("Failed to retrieve FCM token.");
    }
  } catch (error) {
    console.error("Error initializing FCM:", error);
  }
};