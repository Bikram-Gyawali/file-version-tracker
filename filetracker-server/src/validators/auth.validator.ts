import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import validate from "../utils/validate";

// Validation schema
const registrationSchema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().required().label("Role"),
    device_id: Joi.string().required().label("Device Id"),
    name: Joi.string().required().label("Name"),
});

/**
 * Validate create user request.
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
export async function validateRegistration(req: Request, res: Response, next: NextFunction) {
    try {
        await validate(req.body, registrationSchema);

        next();
    } catch (err) {
        next(err)
    }
}

const loginSchema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
})

/**
 * Validates the login request body using the loginSchema.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} - A promise that resolves when the validation is complete.
 */
export async function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await validate(req.body, loginSchema);
    next();
  } catch (err) {
    next(err);
  }
}
