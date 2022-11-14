const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

exports.clearImage = (filePath) => {
	filePath = path.join(__dirname, "..", filePath);
	fs.unlink(filePath, (err) => console.log(err));
};

exports.configStorage = () => {
	const fileStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(path.dirname(process.mainModule.filename), "images"));
		},
		filename: (req, file, cb) => {
			cb(null, uuidv4() + path.extname(file.originalname));
		},
	});
	return fileStorage;
};

exports.configFilterFileUpload = () => {
	const fileFilter = (req, file, cb) => {
		if (
			file.mimetype === "image/png" ||
			file.mimetype === "image/jpg" ||
			file.mimetype === "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	};
	return fileFilter;
};
