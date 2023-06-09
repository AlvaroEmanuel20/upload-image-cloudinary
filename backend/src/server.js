const express = require('express');
const cors = require('cors');
const upload = require('./upload.middleware');
const { uploadToCloudinary, getImagesUrls } = require('./cloudinary.config');
require('dotenv/config');

const app = express();
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('Upload API Cloudinary');
});

app.post('/', upload, async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ message: 'Image is required', status: 400 });

    const { imageId, error } = await uploadToCloudinary(req.file);
    if (error)
      return res.status(400).json({ status: 400, message: error.message });

    res.status(201).json({ imageId, uploaded: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
});

app.get('/images', async (req, res) => {
  try {
    const { imagesUrls, error } = await getImagesUrls();
    if (error)
      return res.status(400).json({ status: 400, message: error.message });

    res.json(imagesUrls);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
