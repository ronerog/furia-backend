const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads/';
    
    if (req.uploadType === 'profile') {
      uploadPath += 'profiles/';
    } else if (req.uploadType === 'product') {
      uploadPath += 'products/';
    } else if (req.uploadType === 'reward') {
      uploadPath += 'rewards/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});

module.exports = {
  uploadSingle: (fieldName, uploadType) => {
    return (req, res, next) => {
      req.uploadType = uploadType;
      upload.single(fieldName)(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        next();
      });
    };
  },
  uploadMultiple: (fieldName, uploadType, maxCount = 5) => {
    return (req, res, next) => {
      req.uploadType = uploadType;
      upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        next();
      });
    };
  }
};