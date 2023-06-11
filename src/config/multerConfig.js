const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../uploads/');
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['jpg', 'png', 'jpeg'];
  const fileExtension = file.originalname.split('.').pop();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); 
  } else {
    cb(new Error('El formato del archivo no es válido. Se permiten solo archivos JPG, PNG y JPEG.'), false); // Rechaza el archivo con el error
  }
};


const multerConfig = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = multerConfig;
