import app from "./app";
import http from "http";
import connectDatabase from "./config/database";
import dotenv from "dotenv";

// dotenv.config({ path: "./config/config.env" });
dotenv.config();
async function init() {
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  const PORT = process.env.PORT || 8000;

  try {
    await connectDatabase();

    const httpServer = http.createServer(app);
    const server = httpServer.listen(PORT, () => {
      console.log(`Server is working on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err: unknown) => {
      if (err instanceof Error) {
        console.error(`Unhandled Rejection: ${err.message}`);
      } else {
        console.error("Unhandled Rejection: Unknown error");
      }
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

init();
