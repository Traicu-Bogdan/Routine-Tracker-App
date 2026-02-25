import express, { Router } from "express"
import type { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";
import { todoRouter } from "./Routes/TodoRouter.js";
import { authRouter } from "./Routes/AuthRouter.js";

import cookieParser from "cookie-parser";

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(todoRouter);
app.get('/', async (req: Request, res: Response) => {
  res.send('App is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
