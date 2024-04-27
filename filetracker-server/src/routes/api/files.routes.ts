import { Router } from "express";
import * as FileController from "../../controllers/files.controller";
import upload from "../../middlewares/multer";
import {
  createFileValidator,
  revertFileVersionValidator,
  updateFileValidator,
} from "../../validators/file.validator";
import { authMiddleware, authPermission } from "../../middlewares/auth";
import { PERMISSIONS } from "../../constants/role_permissions";

const router = Router();

// create file
router.post(
  "/:folderId/",
  authMiddleware,
  upload.single("files"),
  // createFileValidator,
  authPermission(PERMISSIONS.CREATE_FILE),
  FileController.createFile
);

// update file
router.put(
  "/:folderId/:fileId",
  authMiddleware,
  upload.single("files"),
  updateFileValidator,
  authPermission(PERMISSIONS.UPDATE_FILE),
  FileController.updateFile
);

// get file
router.get(
  "/:folderId/",
  authMiddleware,
  authPermission(PERMISSIONS.GET_FILE),
  FileController.getAllFiles
);

// get file by id
router.get("/:folderId/:fileId", FileController.getFileById);

// delete file
router.delete(
  "/:folderId/:fileId",
  authMiddleware,
  authPermission(PERMISSIONS.DELETE_FILE),
  FileController.deleteFile
);

// get all file versions
router.get(
  "/:folderId/:fileId/versions/",
  authMiddleware,
  authPermission(PERMISSIONS.GET_FILE),
  FileController.getAllfileVersions
);


// revert file version id
router.put(
  "/:folderId/:fileId/revert",
  authMiddleware,
  authPermission(PERMISSIONS.UPDATE_FILE),
  revertFileVersionValidator,
  FileController.revertFileVersion
);

// download file
router.get(
  "/:folderId/:fileId/download",
  authMiddleware,
  authPermission(PERMISSIONS.GET_FILE),
  FileController.downloadFile
);

export const File: Router = router;
