export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
};

export const PERMISSIONS = {
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  GET_USER: "get_user",
  GET_USER_BY_ID: "get_user_by_id",
  UPDATE_USER_BY_ID: "update_user_by_id",

  CREATE_FILE: "create_file",
  UPDATE_FILE: "update_file",
  DELETE_FILE: "delete_file",
  GET_FILE: "get_file",

  CREATE_FOLDER: "create_folder",
  UPDATE_FOLDER: "update_folder",
  DELETE_FOLDER: "delete_folder",
  GET_FOLDER: "get_folder",
};

export const ROLE_PERMISSIONS: any = {
  admin: [
    "create_user",
    "get_user",
    "update_user",
    "delete_user",

    "get_user_by_id",
    "update_user_by_id",

    "create_file",
    "update_file",
    "delete_file",
    "get_file",

    "create_folder",
    "update_folder",
    "delete_folder",
    "get_folder",
  ],

  editor: [
    "create_file",
    "update_file",
    "delete_file",
    "get_file",

    "get_folder",
    "create_folder",
    "update_folder",
    "delete_folder",
  ],

  viewer: ["get_file", "get_folder"],
};
