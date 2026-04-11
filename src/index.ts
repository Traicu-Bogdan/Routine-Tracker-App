import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter } from "./Routes/AuthRouter.js";
import { todoRouter } from "./Routes/TodoRouter.js";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Cors - important pentru cookie-uri cross-origin
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Routes
app.use("/auth", authRouter); // ex: /auth/login
app.use("/todos", todoRouter);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
