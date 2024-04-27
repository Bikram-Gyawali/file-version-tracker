import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import validate from "../utils/validate";
import { User } from "../models/User";

const updateUserSchema = Joi.object({
  role: Joi.string().required().not("admin"),
});

/**
 * Validates the user update request and calls the next middleware if validation is successful.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export async function updateUserValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await validate(req.body, updateUserSchema);
        next();
    } catch (error) {
        next(error);
    }
}
