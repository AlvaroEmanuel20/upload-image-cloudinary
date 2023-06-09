const multer = require('multer');

const uploadConfig = multer({
  limits: {
    files: 1,
    fileSize: 1050000,
  },
  fileFilter(req, file, cb) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.mimetype))
      cb(new Error('Invalid file type'), false);

    cb(null, true);
  },
});

function upload(req, res, next) {
  const uploadHandle = uploadConfig.single('image');
  uploadHandle(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    next();
  });
}

module.exports = upload;
