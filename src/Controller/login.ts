import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import type { Request, Response } from "express"

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});

    if(!user) return res.status(401).json({message: "Invalid credentials"});

    const token = jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET!,
        {expiresIn: "1h"}
    );

    return res.json({
        token,
        user: {
            id:user.id,
            email: user.email
        },
    });
}