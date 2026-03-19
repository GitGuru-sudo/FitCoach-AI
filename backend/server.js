import dotenv from "dotenv";

import app from "./app.js";
import { connectDatabase } from "./utils/connectDatabase.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`FitCoach AI backend listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
