/* eslint-disable max-len */
import multer from 'multer';

// Define file storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`); // 23/08/2022
  },
});

// Specify file format that can be saved
function fileFilter(req, file, cb) {
  // eslint-disable-next-line max-len
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });

// File Size Formatter
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));

  // eslint-disable-next-line max-len
  return `${parseFloat((bytes / Math.pow(1000, index)).toFixed(dm))} ${sizes[index]}`;
};

export default { upload, fileSizeFormatter };
