import { Response } from "express";
import { AuthRequest } from "../Middleware/auth.js";


export const getMe = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json({
    user: req.user,
  });
}

