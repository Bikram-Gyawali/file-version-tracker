import app from "./app";
import config from "./config";

import "./db";

app.listen(config.port, () => {
  console.log(`FILE TRACKER API listening on ${config.port}`);
});
