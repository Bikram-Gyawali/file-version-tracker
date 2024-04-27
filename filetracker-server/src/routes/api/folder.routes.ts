import { Router } from "express";
import * as FolderController from "../../controllers/folder.controller";
import { authMiddleware, authPermission } from "../../middlewares/auth";
import { PERMISSIONS } from "../../constants/role_permissions";
import { createFolderValidator, updateFolderValidator } from "../../validators/folder.validator";

const router = Router();

// create folder
router.post(
  "/",
  authMiddleware,
  createFolderValidator,
  authPermission(PERMISSIONS.CREATE_FOLDER),
  FolderController.createFolder
);

// update folder
router.put(
  "/:folderId",
  authMiddleware,
  updateFolderValidator,
  authPermission(PERMISSIONS.UPDATE_FOLDER),
  FolderController.updateFolder
);

// get folders
router.get(
  "/",
  authMiddleware,
  authPermission(PERMISSIONS.GET_FOLDER),
  FolderController.listAllFolders
);

// get folder by id
router.get("/:name", authMiddleware, FolderController.getFolderDetailsById);

// delete folder
router.delete(
  "/:folderId",
  authMiddleware,
  authPermission(PERMISSIONS.DELETE_FOLDER),
  FolderController.deleteFolder
);

export const Folder: Router = router;
