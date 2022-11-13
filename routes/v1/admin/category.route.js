const express = require("express");

const router = express.Router();

const categoryController = require("../../../controllers/category.controller");

// //Create new objective
router.post("/", categoryController.createCategory);

// //Edit objective
router.put("/:id", categoryController.editCategory);

// //Delete objective
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
