import { Request, Response, NextFunction } from "express";
import { File } from "../models/File";
import { handleFileUpload } from "../services/cloudinaryImageUpload.service";
import { User } from "../models/User";
import { SortOrder } from "mongoose";
import { getPagination } from "../utils/pagination";
import { ObjectId } from "mongodb";
import { FileVersion } from "../models/FileVersion";
import logger from "../logging/logger";
import axios from "axios";

/**
 * Creates a file files item using the provided request data and saves it to the database.
 *
 * @param {Request} req - the request object containing the files data
 * @param {Response} res - the response object for sending the result
 * @return {Promise<void>} a Promise that resolves when the files is created successfully
 */
export const createFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.headers.user;
    const folderId = req.params.folderId;
    let { title, tags, description } = req.body;

    let feature_url = null;
    if (req.file) {
      feature_url = await handleFileUpload(req.file, `${user}`);
    }

    const fileId = new ObjectId();

    const checkNameExist = await File.exists({ title, folder: folderId });

    if (checkNameExist) {
      return res
        .status(400)
        .json({ message: "File name already exists.", success: false });
    }

    const files = await new File({
      _id: fileId,
      title,
      external_url: feature_url,
      folder: folderId,
      tags: tags?.split(","),
      description,
    });

    const fileVersion = new FileVersion({
      _id: new ObjectId(),
      activeVersionId: fileId,
      allVersionIds: [fileId],
      folder: folderId,
      user: user as string,
    });

    await fileVersion.save();

    await files.save();

    return res
      .status(201)
      .json({ message: "files created successfully", success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates files in the database.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} a Promise that resolves when the files is updated
 */
export const updateFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: string = req.headers.user as string;
    const { fileId, folderId } = req.params;
    let { title, author, tags, description, revertVersionId } = req.body;
    let feature_url = null;

    if (req.file) {
      feature_url = await handleFileUpload(req.file, `${user}`);
    }

    const newFileId: any = new ObjectId();
    console.log("here", fileId);
    const updatedFile = new File(
      {
        _id: newFileId,
        title,
        external_url: feature_url,
        author,
        tags,
        description,
        folder: folderId,
        createdAt: new Date(),
      },
      { new: true }
    );

    updatedFile.save();

    console.log("file id", fileId);
    const getExistingFileVersion = await FileVersion.findOne({
      allVersionIds: { $in: fileId },
      folderId: folderId,
    })
      .lean()
      .exec();

    console.log("here", getExistingFileVersion);
    if (!revertVersionId && getExistingFileVersion != null) {
      await FileVersion.findByIdAndUpdate(
        { _id: getExistingFileVersion._id, folderId: folderId, user: user },
        {
          $set: {
            activeVersionId: newFileId,
          },
          $push: {
            allVersionIds: newFileId,
          },
        }
      );
    } else {
      await FileVersion.findByIdAndUpdate(
        { _id: getExistingFileVersion._id, folderId: folderId, user: user },
        {
          $set: {
            activeVersionId: revertVersionId,
          },
        }
      );
    }

    return res.status(201).json({
      message: "files updated successfully",
      data: updatedFile,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves files based on the provided query parameters, and returns the data along with pagination details.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} Promise that resolves to the files data and pagination details
 */
export const getAllFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit,
      offset,
      q: search_keyword,
      sort_column,
      sort_order,
    } = req.query;

    const folderId = req.params.folderId;
    console.log("here", folderId);
    let sort_query: string | { [key: string]: SortOrder } = {};

    if (sort_column) {
      sort_query[String(sort_column)] = sort_order === "asc" ? 1 : -1;
      sort_query["_id"] = 1;
    }

    let user = req.headers.user as string;

    let query: Record<string, any> = {
      folder: folderId,
    };

    const is_searchable: boolean =
      search_keyword && typeof search_keyword == "string";
    const searchRegex = { $regex: search_keyword, $options: "i" };

    if (is_searchable) {
      query = {
        ...query,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ],
      };
    }

    const fileVersion = await FileVersion.find({
      user: user,
      folder: folderId,
    })
      .lean()
      .exec();
    console.log("file versions", fileVersion);
    const filesIds = fileVersion.map((v) => v.activeVersionId.toString());
    console.log("filesIds", filesIds);
    const files = await File.find({
      ...query,
      _id: { $in: filesIds.map((id) => new ObjectId(id)) },
    })
      .sort(sort_query)
      .limit(Number(limit || 20))
      .skip(Number(offset || 0))
      .lean()
      .exec();

    console.log("files", files);

    const pagination = await getPagination(
      Number(limit || 20),
      Number(offset || 0),
      File,
      query
    );

    return res.status(200).json({ data: files, pagination });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves files details by ID and checks user authorization.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} returns a promise with no specific value
 */
export const getFileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId, folderId } = req.params;
    const user = req.headers.user as string;
    let query;

    if (ObjectId.isValid(fileId)) {
      query = { _id: fileId, folder: folderId };
    }

    const filesDetails = await File.findOne(query).lean().exec();

    const fileVersions = await FileVersion.find({
      allVersionIds: { $in: filesDetails._id },
      folderId: folderId,
      user: user,
    });

    if (!filesDetails) {
      return res.status(200).json({ message: "File not found" });
    }

    return res.status(200).json({ data: filesDetails, versions: fileVersions });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete files based on filesId and user permissions.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @return {Promise<void>} Promise that resolves after deleting files or sending response
 */
export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId, folderId } = req.params;
    const user = req.headers.user as string;

    const fileVersion = await FileVersion.findOne({
      user: user,
      folder: folderId,
      allVersionIds: { $in: fileId },
    });

    if (!fileVersion) {
      return res.status(200).json({ message: "File not found" });
    }

    await FileVersion.updateOne(
      { _id: fileVersion._id },
      { $pull: { allVersionIds: fileId } },
      { new: true }
    );

    let activeVersionId = fileVersion.activeVersionId;

    if (activeVersionId.toString() === fileId) {
      const updatedFileVersion = await FileVersion.findOne({
        _id: fileVersion._id,
      });
      activeVersionId = updatedFileVersion.allVersionIds.slice(-1)[0];
      await FileVersion.updateOne(
        { _id: fileVersion._id },
        { $set: { activeVersionId } }
      );
    }

    await File.findByIdAndDelete(fileId);

    return res
      .status(200)
      .json({ message: "File deleted successfully", success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

/**
 * Asynchronous function to retrieve a list of files with optional search, sorting, pagination, and population of author data.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} a Promise that resolves to nothing
 */
export const getFileList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    let query: Record<string, any> = {};

    const is_searchable: boolean =
      search_keyword && typeof search_keyword == "string";
    const searchRegex = { $regex: search_keyword, $options: "i" };
    if (is_searchable) {
      query = {
        ...query,
        $or: [
          { title: searchRegex },
          { tags: searchRegex },
          { description: searchRegex },
        ],
      };
    }

    const files = await File.find(query)
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
    next(error);
  }
};

/**
 * Downloads a file based on the provided file ID and folder ID.
 *
 * @param {Request} req - The request object containing the file ID and folder ID.
 * @param {Response} res - The response object used to send the downloaded file.
 * @param {NextFunction} next - The next function to be called in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the file is downloaded successfully.
 */
export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId, folderId } = req.params;
    const user = req.headers.user as string;

    const fileVersion = await FileVersion.findOne({
      user: user,
      folder: folderId,
      allVersionIds: { $in: fileId },
    });

    if (!fileVersion) {
      return res.status(200).json({ message: "File not found" });
    }

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(200).json({ message: "File not found" });
    }

    const filePath = file.external_url;

    if (!filePath) {
      return res.status(200).json({ message: "File not found" });
    }

    // Download file from Cloudinary
    const response = await axios({
      method: "GET",
      url: filePath,
      responseType: "stream",
    });

    // Set headers for download
    res.set({
      "Content-Disposition": `attachment; filename="${extractFilenameFromUrl(
        filePath
      )}"`,
      "Content-Type": response.headers["content-type"],
    });

    // Pipe the response stream to the response object to start the download
    response.data.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getAllfileVersions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId, folderId } = req.params;
    const user = req.headers.user as string;

    const allFileVersions = await FileVersion.findOne({
      user: user,
      folder: folderId,
      allVersionIds: { $in: fileId },
    });

    if (!allFileVersions) {
      return res.status(200).json({ message: "File not found" });
    }

    const activeFile = allFileVersions.activeVersionId;

    const allFileVersionsDetail = await File.find({
      _id: { $in: allFileVersions.allVersionIds },
    });

    return res
      .status(200)
      .json({ data: { allFileVersionsDetail, activeFile } });
  } catch (error) {
    next(error);
  }
};

/**
 * Reverts the version ID of a file in a folder for a specific user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function
 * @return {Promise<void>} a Promise that resolves when the version ID is successfully reverted
 */
export const revertFileVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId, folderId } = req.params;
    const { revertVersionId } = req.body;
    const user = req.headers.user as string;

    const fileVersion = await FileVersion.findOneAndUpdate(
      {
        user: user,
        folder: folderId,
        allVersionIds: { $in: fileId },
      },
      {
        activeVersionId: revertVersionId,
      }
    );

    if (!fileVersion) {
      return res.status(200).json({ message: "File not found" });
    }

    return res.status(200).json({
      data: fileVersion,
      message: "File reverted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to extract the filename from the URL
function extractFilenameFromUrl(url: string) {
  return url.split("/").pop();
}
