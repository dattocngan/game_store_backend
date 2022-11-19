const express = require("express");

const router = express.Router();

const multer = require("multer");

const categoryController = require("../../controllers/category.controller");

const gameController = require("../../controllers/game.controller");
const isAdmin = require("../../middlewares/is-admin");
const { s3Upload } = require("../../helpers/s3");

const { configFilterFileUpload } = require("../../helpers/upload");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: configFilterFileUpload(),
});

// Get all categories
router.get("/", categoryController.getCategories);

// //Get objective by id
router.get("/:id", categoryController.getCategory);

// //Create new objective
router.post(
  "/",
  isAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    const imageResult = await s3Upload(req.files.image);
    res.locals.image = imageResult[0].key;
    next();
  },
  categoryController.createCategory,
);

// //Edit objective
router.put(
  "/:id",
  isAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    if (Object.keys(req.files).length > 0) {
      if (req.files.image) {
        const imageResult = await s3Upload(req.files.image);
        res.locals.image = imageResult[0].key;
      }
    }
    next();
  },
  categoryController.editCategory,
);

// //Delete objective
router.delete("/:id", isAdmin, categoryController.deleteCategory);

module.exports = router;
