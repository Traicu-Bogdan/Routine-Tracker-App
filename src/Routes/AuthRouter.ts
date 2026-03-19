import { Router } from "express";
import { validate } from "../Middleware/validate.js";
import { login } from "../Controller/login.js";
import { register } from "../Controller/signin.js";
import { loginSchema } from "../Schemas/auth.login.schema.js";
import { registerSchema } from "../Schemas/auth.register.schema.js";
import { authMiddleware } from "../Middleware/auth.js";
import { getMe } from "../Controller/auth.js";
import { logout } from "../Controller/logout.js";


export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/register', validate(registerSchema), register);
authRouter.get('/me', authMiddleware, getMe);
authRouter.post('/logout', authMiddleware, logout);


