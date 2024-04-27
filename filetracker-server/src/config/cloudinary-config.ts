// cloudinary-config.js
import cloudinary from "cloudinary";
import config from "../config";

cloudinary.v2.config({
  cloud_name: config.cloudinaryConfig.cloud_name,
  api_key: config.cloudinaryConfig.api_key,
  api_secret: config.cloudinaryConfig.api_secret,
});

export default cloudinary;
