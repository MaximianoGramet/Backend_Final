import multer from "multer";
import path from "path";

const getDestination = (type) => {
  if (type === "profile") {
    return "profiles";
  } else if (type === "product") {
    return "products";
  } else if (type === "document") {
    return "documents";
  } else {
    throw new Error("Invalid type");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.body.type;
    const destFolder = getDestination(type);
    cb(null, destFolder);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage }).single("image");

const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Multer error", error: err });
    } else if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: err });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    req.uploadedFile = { fileName, filePath };
    next();
  });
};

export default uploadMiddleware;
