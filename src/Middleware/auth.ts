import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extinde Request pentru a include user-ul
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // extrage token-ul din cookie-ul 'token'
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    // verifică și decodează JWT-ul
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };

    // pune payload-ul în req.user
    req.user = { id: payload.id, email: payload.email };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};