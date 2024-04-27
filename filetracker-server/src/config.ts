import "./env";
import * as process from "process";

/**
 * Application wide configuration.
 */
const config = {
  firebaseAuthClientConfig: {
    apiKey: process.env.GOOGLE_AUTH_API_KEY,
    authDomain: process.env.GOOGLE_AUTH_AUTH_DOMAIN,
    projectId: process.env.GOOGLE_AUTH_PROJECT_ID,
    storageBucket: process.env.GOOGLE_AUTH_STORAGE_BUCKET,
    messagingSenderId: process.env.GOOGLE_AUTH_MESSAGING_SENDER_ID,
    appId: process.env.GOOGLE_AUTH_APP_ID,
  },
  mongodbURI: process.env.MONGODB_URI,
  port: process.env.PORT || 5007,
  isProduction: process.env.NODE_ENV === "production",
  clientUrl: process.env.CLIENT_URL,
  secretKey: process.env.SECRET_KEY || "secret",
  salt: process.env.SALT || 10,
  cloudinaryConfig: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
