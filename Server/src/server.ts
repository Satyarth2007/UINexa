import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

connectDB()
  .then(() => app.listen(env.PORT, () => console.log(`Server running on :${env.PORT}`)))
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });