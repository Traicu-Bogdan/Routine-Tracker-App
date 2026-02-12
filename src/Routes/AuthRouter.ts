import { Router } from "express";
import { validate } from "../Middleware/validate.js";
import { login } from "../Controller/login.js";
import { register } from "../Controller/signin.js";
import { loginSchema } from "../Schemas/auth.login.schema.js";
import { registerSchema } from "../Schemas/auth.register.schema.js";
import type { LoginSchema } from "../Schemas/auth.login.schema.js";
import type { RegisterSchema } from "../Schemas/auth.register.schema.js";


export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/register', validate(registerSchema), register);


