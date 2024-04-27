import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ROLES } from "../constants/role_permissions";
import { AuthHeaders } from "auth.types";
import { IncomingHttpHeaders } from "http";
import { getPagination } from "../utils/pagination";
import { SortOrder } from "mongoose";
import { sendNotification } from "../services/notification.service";
import logger from "../logging/logger";

/**
 * Retrieves a user from the database based on the request parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers: IncomingHttpHeaders = req.headers as IncomingHttpHeaders;

    const {
      limit,
      offset,
      q: search_keyword,
      sort_column,
      sort_order,
    } = req.query;

    // column wise sorting
    let sort_query: string | { [key: string]: SortOrder } = {};

    if (sort_column) {
      sort_query[String(sort_column)] = sort_order === "asc" ? 1 : -1;
      sort_query["_id"] = 1;
    }

    // search
    const is_searchable: boolean =
      search_keyword && typeof search_keyword == "string";

    let query: Record<string, any> = {};

    if (is_searchable) {
      query = {
        ...query,
        $or: [
          { capitalized_name: { $regex: search_keyword, $options: "i" } },
          { email: { $regex: search_keyword, $options: "i" } },
        ],
      };
    }

    const allUsers = await User.find(query)
      .sort(sort_query)
      .limit(Number(limit || 20))
      .skip(Number(offset || 0))
      .lean()
      .exec();

    const pagination = await getPagination(
      Number(limit || 20),
      Number(offset || 0),
      User,
      query
    );

    return res.status(200).json({ data: allUsers, pagination });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the role of a user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} a promise that resolves to void
 */
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body;

    const userId = req.params.userId;

    if (!userId || !role) {
      return res
        .status(400)
        .json({ message: "userId and role are required", success: false });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.role === role) {
      return res
        .status(400)
        .json({ message: "User already has this role", success: false });
    }

    if (role === "admin") {
      return res
        .status(400)
        .json({
          message: "Admin cannot be assigned as a role",
          success: false,
        });
    }

    user.role = role;

    await user.save();


    await sendNotification(
      "User Role Updated",
      `Your role has been updated to ${role}`,
      JSON.stringify({ role }),
      user.device_id
    );

    return res
      .status(200)
      .json({ message: "User role updated successfully", success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
