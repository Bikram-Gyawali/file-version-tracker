import { initializeApp } from "@firebase/app";
import { getMessaging, getToken, onMessage } from "@firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const setupNotifications = async () => {
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Get the FCM token
      const token = await getToken(messaging);
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied.");
    }
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      // Handle the notification or update your UI
    });
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
};
export { messaging };
