const express = require("express");

const router = express.Router();

const categoryController = require("../../controllers/category.controller");
const isAdmin = require("../../middlewares/is-admin");

// Get all categories
router.get("/", categoryController.getCategories);

// //Get objective by id
router.get("/:id", categoryController.getCategory);

// //Create new objective
router.post("/", isAdmin, categoryController.createCategory);

// //Edit objective
router.put("/:id", isAdmin, categoryController.editCategory);

// //Delete objective
router.delete("/:id", isAdmin, categoryController.deleteCategory);

module.exports = router;
