// apiService/notificationService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/notifications';

export const sendNotification = async ({ title, body, token }) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, token }),
    });

    return await res.json();
  } catch (error) {
    console.error("Notification send failed:", error);
    return { success: false, error: error.message };
  }
};
