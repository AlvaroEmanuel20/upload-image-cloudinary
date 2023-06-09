const cloudinary = require('cloudinary').v2;
const DataUriParser = require('datauri/parser');
const path = require('node:path');
require('dotenv/config');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const parser = new DataUriParser();
async function uploadToCloudinary(file) {
  try {
    const fileExtension = path.extname(file.originalname);
    const dataUri = parser.format(fileExtension, file.buffer);

    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: 'upload-image-cloudinary',
      public_id: `${Date.now()}_${path.basename(
        file.originalname,
        fileExtension
      )}`,
    });

    return { imageId: result.public_id };
  } catch (error) {
    return { error };
  }
}

async function getImagesUrls() {
  try {
    const { resources } = await cloudinary.api.resources_by_asset_folder(
      'upload-image-cloudinary',
      {
        max_results: 6,
        direction: -1,
      }
    );

    const imagesUrls = resources.map((resource) => {
      return cloudinary.url(resource.public_id);
    });

    return { imagesUrls };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

module.exports = { uploadToCloudinary, getImagesUrls };
