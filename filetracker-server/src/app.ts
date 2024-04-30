import cors from "cors";
import express from "express";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import helmet from "helmet";
import { initializeFirebaseAdmin } from "./config/firebase";

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

initializeFirebaseAdmin();

app.use("/api", apiRoutes);
app.use(errorHandler);

export default app;
