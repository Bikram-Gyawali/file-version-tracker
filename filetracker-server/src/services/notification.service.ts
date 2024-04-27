import * as admin from "firebase-admin";
import logger from "../logging/logger";

/**
 * Send notification to mobile device.
 * @param {string} title
 * @param {string} body
 * @param {object} data
 * @param {string} deviceToken
 * @returns {Promise<void>}
 */
export const sendNotification = async (
  title: string,
  body: string,
  data: string,
  deviceToken: string
): Promise<void> => {
  try {
    
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      data: { data },
      token: deviceToken,
    };

    await admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  } catch (err) {
    logger.error("Failed to send notification: " + (err as Error).message);
    console.log("Failed to send notification: " + (err as Error).message);
  }
};
