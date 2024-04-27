import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ROLE_PERMISSIONS } from "../constants/role_permissions";
import { getUserRole } from "../services/user.services";
import config from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Authentication middleware
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export async function auth(req: any, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth.user_id;
    let user: any = await User.findById(userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    /**
     * Add user id to request header.
     */
    if (user) {
      req.headers.user = user._id;
      req.headers.email = user.email;
      req.headers.role = user.role;
      return next();
    }

    return next(new Error("User not found"));
  } catch (err) {
    return next(new Error("Authentication failed"));
  }
}

/**
 * Authorize the permission.
 *
 * @param { string } permission
 */
export function authPermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {

    const role = req.headers?.role;

    const user_role = getUserRole(role);
    if (!ROLE_PERMISSIONS[user_role].includes(permission)) {
      res.status(403);
      return res.send({ message: 'You do not have permission to perform this action' })
    }

    next();
  }
}

/**
 * Middleware function to authenticate the request using a JWT token.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the authentication is successful or rejects with an error.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // check if the header starts with "Bearer " prefix
      const token = authHeader.split(" ")[1]; // split the header and get the token part
      authHeader = token;
    }

    jwt.verify(
      authHeader,
      config.secretKey,
      async (error, data: JwtPayload) => {
        if (error) {
          console.log("error", error);
          return res.status(401).send({ message: "invalid token" });
        } else {
          req.headers.user = data.user_id;
          req.headers.email = data.email;
          req.headers.role = data.role;
          next();
        }
      }
    );
  } catch (error) {
    return res.status(401).send({ message: "invalid token" });
  }
}