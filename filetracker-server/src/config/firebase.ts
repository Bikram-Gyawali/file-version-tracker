import * as admin from "firebase-admin";
export const serviceAccount = require("../../serviceAccount.json");
export const initializeFirebaseAdmin = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
