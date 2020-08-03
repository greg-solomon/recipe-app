import multer from "multer";

// specifies storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(__dirname);
    cb(null, `${__dirname}/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// file validation
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    // prevent upload
    cb({ message: "Unsupported file format" }, false);
  }
};

export default multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});
