import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import type { Request, Response } from "express"
import bcrypt from 'bcrypt'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Verifică parola
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000
  })

  return res.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
    },
  });

}
