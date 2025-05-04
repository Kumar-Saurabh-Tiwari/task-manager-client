importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAmb4fLYmprx5SsPf5hObmRM6gIbhOFCOA",
  authDomain: "task-app-bb207.firebaseapp.com",
  projectId: "task-app-bb207",
  storageBucket: "task-app-bb207.appspot.com",
  messagingSenderId: "586634210747",
  appId: "1:586634210747:web:37197156474a471d83a89e",
  measurementId: "G-PBDY90MM3V",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192x192.png", // Replace with your icon if available
  });
});
