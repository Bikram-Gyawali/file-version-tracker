import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
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
