const express = require("express");

const router = express.Router();

const isAuth = require("../../middlewares/is-auth");
const authController = require("../../controllers/auth.controller");

//Login
router.post("/login", authController.login);

//Signup
router.post("/signup", authController.signup);

//Get profile
router.get("/user", isAuth, authController.getUser);

//Edit profile or password
router.put("/user", isAuth, authController.editUser);

module.exports = router;
