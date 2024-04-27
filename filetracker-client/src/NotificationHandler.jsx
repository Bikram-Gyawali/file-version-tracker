import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

firebase.initializeApp(firebaseConfig);

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

      // display a toast notification
      const toastMessage = `${payload.notification.title}: ${payload.notification.body}`;
      toast(toastMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    messaging.onMessage(handleNotification);

    return () => {
      messaging.onMessage(handleNotification);
    };
  }, []);

  return <ToastContainer />;
};

export default NotificationHandler;
