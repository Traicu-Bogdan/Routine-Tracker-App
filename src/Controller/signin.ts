import { prisma } from '../lib/prisma.js';
import type { Request, Response } from 'express';
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required!" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exist!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    password: user.password,
  });

};
