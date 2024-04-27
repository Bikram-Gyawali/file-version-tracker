import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

// firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const NotificationHandler = () => {
  useEffect(() => {
    const handleNotification = (payload) => {
      console.log("Message received:", payload);
      const data = JSON.parse(payload.data.data);

      if (data?.role) {
        localStorage.setItem("role", data?.role);
        // refresh the page
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

      //   display a toast notification
      const toastMessage = `${payload.notification.title}: ${payload.notification.body}`;

      const toast = document.createElement("div");
      toast.textContent = toastMessage;
      //   toast.classList.add("toast");
    };

    messaging.onMessage(handleNotification);

    return () => {
      messaging.onMessage(handleNotification);
    };
  }, []);

  return null;
};

export default NotificationHandler;
