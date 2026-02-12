import type { Request, Response, NextFunction } from "express";
import {z} from "zod";

type ReqShape = {
    body?: unknown;
    params?: unknown;
    query?: unknown;
}

export const validate = (schema:z.ZodType<ReqShape>) => 
    (req:Request,res:Response, next: NextFunction) => {
        const result = schema.safeParse({
            body:req.body,
            params: req.params,
            query: req.query,
        });

        if(!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: z.treeifyError(result.error),
            });
        }

        if (result.data.body !== undefined) req.body = result.data.body;
        if (result.data.params !== undefined) req.params = result.data.params as any;
        if (result.data.query !== undefined) req.query = result.data.query as any;

        next();
    }