import express, { Application } from "express";
import path from "path";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import errorMiddleware from "./middleware/error";
import apiRoutes from "./routes/api.routes";

const app: Application = express();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3001",
  // "http://localhost:3002",
];

app.use(compression());
app.use(helmet({
   crossOriginOpenerPolicy: false,  
    crossOriginEmbedderPolicy: false
}));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = path.join(__dirname,process.env.NODE_ENV === "development"? "../frontend/dist":"../../frontend/dist");
app.use(express.static(staticPath));

app.use("/api/v1", apiRoutes);
app.get("/test", (req, res)=>{
  res.json({success:true})
})
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.use(errorMiddleware);

export default app;
