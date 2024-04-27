import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import validate from "../utils/validate";

const createFileSchema = Joi.object({
  title: Joi.string().required(),
  tags: Joi.string(),
  description: Joi.string(),
  file: Joi.string(),
})


/**
 * Asynchronous function to validate the request body for creating news.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} promise that resolves after validation
 */
export async function createFileValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await validate(req.body, createFileSchema);
    next();
  } catch (error) {
    next(error);
  }
}

const updateFileSchema = Joi.object({
  title: Joi.string(),
  tags: Joi.string(),
  description: Joi.string(),
  revertVersionId: Joi.string(),
  files: Joi.string(),
});

/**
 * Asynchronous function to validate news update with request, response, and next function.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @return {Promise<void>} Promise that resolves with void
 */
export const updateFileValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validate(req.body, updateFileSchema);
    next();
  } catch (error) {
    next(error);
  }
}

const revertFileSchema = Joi.object({
  revertVersionId: Joi.string().required(),
})

/**
 * Validates the request body for reverting a file version.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} promise that resolves after validation
 */
export const revertFileVersionValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validate(req.body, revertFileSchema);
    next();
  } catch (error) {
    next(error);
  }
}