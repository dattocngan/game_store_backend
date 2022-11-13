const express = require("express");

const router = express.Router();
const categoryRoute = require("./category.route");

router.use("/categories", categoryRoute);

module.exports = router;
