const express = require("express");

const router = express.Router();

const isAdmin = require("../../middlewares/is-admin");
const authRoute = require("./auth.route");
const adminRoute = require("./admin");
const gameRoute = require("./game.route");
const categoryRoute = require("./category.route");

router.use("/auth", authRoute);
router.use("/categories", categoryRoute);
router.use("/games", gameRoute);

module.exports = router;
