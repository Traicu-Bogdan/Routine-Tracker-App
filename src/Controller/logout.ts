import { AuthRequest } from "../Middleware/auth.js";
import { Response } from "express";

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}
