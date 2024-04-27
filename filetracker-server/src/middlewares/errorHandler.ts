import { Request, Response, NextFunction } from "express";

/**
 * Generic error response middleware.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    ["Token not found", "User not found", "Authentication failed", "jwt expired", "invalid algorithm"].includes(
      err.message
    )
  ) {
    return res.status(401).send({ message: err.message });
  }
  console.log(err);
  return res.status(404).send({ message: err.message });
}
