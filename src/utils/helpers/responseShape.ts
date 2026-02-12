import type { Response } from "express";

export const success = <T>(res:Response, data: T, message = "success", status = 200) : Response => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
}

export const error = (res:Response, message = "Error", status = 500, errors : unknown = null):Response => {
    return res.status(status).json({
        success: false,
        message,
        errors,
    });
}