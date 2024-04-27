import { Request, Response, NextFunction } from "express";
import { File } from "../models/File";
import { User } from "../models/User";
import { SortOrder } from "mongoose";
import { getPagination } from "../utils/pagination";
import { ObjectId } from "mongodb";
import { Folder } from "../models/Folder";
import { CreateFolderInterface, CreateFolderResponse } from "../interface/folder.interface";
import logger from "../logging/logger";
import { FileVersion } from "../models/FileVersion";

/**
 * Creates a new folder in the database.
 *
 * @param {Request} req - the request object containing the folder data
 * @param {Response} res - the response object for sending the result
 * @param {NextFunction} next - the next function in the middleware chain
 * @return {Promise<void>} a Promise that resolves when the folder is created successfully
 */
export const createFolder = async (
  req: Request<{}, {}, CreateFolderInterface>,
  res: Response<CreateFolderResponse>,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    let { name } = req.body;

    const checkNameExist = await Folder.exists({ name, author: user });

    if (checkNameExist) {
      return res
        .status(400)
        .json({ message: "Folder name already exists.", success: false });
    }

    const folder = await Folder.findOneAndUpdate(
      { name, author: user },
      { name },
      { upsert: true, new: true }
    );

    await folder.save();
      logger.info("Folder created successfully");
    res
      .status(201)
      .json({ message: "Folder created successfully", success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const updateFolder = async (
  req: Request<{folderId: string}>,
  res: Response<CreateFolderResponse>,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    let { folderId } = req.params;
    let { name: newName } = req.body;

    const checkNameExist = await Folder.exists({ name: newName, author: user });

    if (checkNameExist) {
      return res
        .status(400)
        .json({ message: "Folder name already exists.", success: false });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, author: user },
      { name: newName, author: user as string },
    );

    if(!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found", success: false });
    }
    
    await folder.save();
    logger.info("Folder updated successfully");
    res
      .status(201)
      .json({ message: "Folder updated successfully", success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * Deletes a folder from the database.
 *
 * @param {Request} req - the request object containing the folder ID
 * @param {Response} res - the response object for sending the result
 * @param {NextFunction} next - the next function in the middleware chain
 * @return {Promise<void>} a Promise that resolves when the folder is deleted successfully
 */
export const deleteFolder = async (
  req: Request<{ folderId: string }>,
  res: Response<{ message: string; success: boolean }>,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const { folderId } = req.params;

    const folder = await Folder.findOne({ _id:folderId, author: user });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found", success: false });
    }

    if (folder.author.toString() !== user) {
      return res.status(403).json({
        message: "You are not authorized to delete this folder",
        success: false,
      });
    }

    await Folder.findByIdAndDelete(folder._id);

    await File.find({ folder: folder._id }).deleteMany();
    await FileVersion.find({ folder: folder._id }).deleteMany();

    return res
      .status(200)
      .json({ message: "Folder deleted successfully", success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};


/**
 * Asynchronously retrieves all folders based on query parameters, populates author data, and handles pagination.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - Returns a Promise that resolves to void.
 */
export const getAllFolders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const {
      limit,
      offset,
      q: search_keyword,
      sort_column,
      sort_order,
    } = req.query;

    let sort_query: string | { [key: string]: SortOrder } = {};

    if (sort_column) {
      sort_query[String(sort_column)] = sort_order === "asc" ? 1 : -1;
      sort_query["_id"] = 1;
    }

    const is_searchable: boolean =
      search_keyword && typeof search_keyword == "string";

    let query: Record<string, any> = {
      author: user,
    };

    const searchRegex = { $regex: search_keyword, $options: "i" };
    if (is_searchable) {
      query = {
        ...query,
        $or: [{ title: searchRegex }],
      };
    }

    const files = await Folder.find(query)
      .populate({
        path: "author",
        select: "capitalized_name",
      })
      .sort(sort_query)
      .limit(Number(limit || 20))
      .skip(Number(offset || 0))
      .lean()
      .exec();

    const pagination = await getPagination(
      Number(limit || 20),
      Number(offset || 0),
      File,
      query
    );

    return res.status(200).json({ data: files, pagination });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * Asynchronously retrieves folder details by ID, checks authorization, and fetches files in the folder.
 *
 * @param {Request} req - The request object containing user data and folder ID
 * @param {Response} res - The response object for sending the result
 * @param {NextFunction} next - The next function in the middleware chain
 * @return {Promise<void>} a Promise that resolves when folder details are fetched successfully
 */
export const getFolderDetailsById = async (
  req: Request<{ name: string }>,
  res: Response<{ data: any; success: boolean, message: string }>,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const { name } = req.params;
    console.log("params", name);
    const folder = await Folder.findOne({ name: name, author: user }).lean();

    if (!folder) {
      return res
        .status(404)
        .json({
          message: "Folder not found", success: false,
          data: undefined
        });
    }

    if (folder.author.toString() !== user) {
      return res.status(403).json({
        message: "You are not authorized to access this folder",
        success: false,
        data: undefined
      });
    }

    const filesInFolder = await File.find({ folder: folder._id }).lean().exec();
    logger.info("new file created");
    logger.on("error", (error) => {
      logger.error(error);
      console.log("hello error");
    });
    return res
      .status(200)
      .json({
        data: { folder, files: filesInFolder }, success: true,
        message: ""
      });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};


/**
 * Asynchronously lists all folders for a given user
 * @param {Request} req - The request object containing user data
 * @param {Response} res - The response object for sending the result
 * @param {NextFunction} next - The next function in the middleware chain
 * @return {Promise<void>} a Promise that resolves when folders are listed successfully
 */
export const listAllFolders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const folders = await Folder.find({ author: user }).lean().exec();
    return res.status(200).json({ data: folders, success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}
