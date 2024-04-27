import multer from "multer";
import path from "path";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();

/**
 * Filters the image file based on allowed types and calls the callback accordingly.
 *
 * @param {any} req - the request object
 * @param {any} file - the file to be filtered
 * @param {any} cb - the callback function
 * @return {void} calls the callback with the appropriate parameters
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/txt",
    "application/octet-stream", // Allow files with any extension
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type."),
      false
    ); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
