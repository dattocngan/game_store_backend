require("dotenv/config");

const Category = require("../models/category");
const Game = require("../models/game");

//Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    categories.forEach((category) => {
      category.image = process.env.DOMAIN_IMAGE + category.image;
    });

    res.status(200).json({
      categories: categories,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get a category by id
exports.getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({
      _id: id,
    }).populate("games", "name feature_image -category");

    if (!category) {
      const error = new Error("Cannot find the category!");
      error.statusCode = 404;
      throw error;
    }

    category.image = process.env.DOMAIN_IMAGE + category.image;

    res.status(200).json({
      category,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Create category
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = res.locals.image;

    await Category.create({
      name,
      image,
    });

    res.status(201).json({
      message: "Created successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Edit category
exports.editCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({
      _id: id,
    });

    if (!category) {
      const error = new Error("Cannot find the objective!");
      error.statusCode = 404;
      throw error;
    }

    const { name } = req.body;

    category.name = name || category.name;

    if (res.locals.image) {
      category.image = res.locals.image;
    }

    await category.save();

    res.status(200).json({
      message: "Updated successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({
      _id: id,
    });

    if (!category) {
      const error = new Error("Cannot find the category!");
      error.statusCode = 404;
      throw error;
    }

    await Promise.all([
      Category.findByIdAndDelete(id),
      Game.deleteMany({ category: id }),
    ]);

    res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
