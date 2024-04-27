import mongoose from "mongoose";

import config from "./config";

let mongoDB = config.mongodbURI;

// Connect mongo
export const connectDB = () => {
  console.log("MongoDB URI:", mongoDB);
  mongoose
    .connect(mongoDB)
    .then(() => {
      if (!config.isProduction) {
        // set('debug', (collection, method, query, doc) => {
        //     console.log(`${collection}.${method}`, JSON.stringify(query), doc);
        // });
      }
      console.log("DB Connected!");
    })
    .catch((err) => {
      console.log(`DB Connection Error: ${err.message}`);
    });
};
connectDB();
