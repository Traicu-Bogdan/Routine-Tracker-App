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
  origin: "http://localhost:3000", // frontend-ul tău
  credentials: true, // permite trimiterea cookie-urilor
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
