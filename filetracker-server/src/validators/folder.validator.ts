import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import validate from "../utils/validate";

const createFolderSchema = Joi.object({
  name: Joi.string().required(),
});

/**
 * Asynchronous function to validate the request body for creating news.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} promise that resolves after validation
 */
export async function createFolderValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await validate(req.body, createFolderSchema);
    next();
  } catch (error) {
    next(error);
  }
}

const updateFolderSchema = Joi.object({
  name: Joi.string(),
});

/**
 * Asynchronous function to validate news update with request, response, and next function.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @return {Promise<void>} Promise that resolves with void
 */
export const updateFolderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validate(req.body, updateFolderSchema);
    next();
  } catch (error) {
    next(error);
  }
};
