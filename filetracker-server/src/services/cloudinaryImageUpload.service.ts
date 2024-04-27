import cloudinary from "../config/cloudinary-config";

/**
 * Asynchronously handles the upload of an image.
 *
 * @param {any} file - the file to be uploaded
 * @return {Promise<string>} the secure URL of the uploaded image
 */
export const handleFileUpload = async (file: any, folder: string) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;

  const image = await cloudinary.v2.uploader.upload(dataURI, {
    folder: folder || "data",
  });

  return image.secure_url;
};
