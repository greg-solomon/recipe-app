import { CloudinaryUpload } from "../routes/recipe";
const cloudinary = require("cloudinary");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploads = async (
  file: any,
  folder: any
): Promise<CloudinaryUpload> => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result: any) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};
