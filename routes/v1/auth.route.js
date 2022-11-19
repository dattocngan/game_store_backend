const express = require("express");

const router = express.Router();

const isAuth = require("../../middlewares/is-auth");
const authController = require("../../controllers/auth.controller");
const isAdmin = require("../../middlewares/is-admin");

//Login
router.post("/login", authController.login);

//Signup
router.post("/signup", authController.signup);

//Get profile
router.get("/profile", isAuth, authController.getProfile);

//Edit profile or password
router.put("/profile", isAuth, authController.editProfile);

//Get a user
router.get("/user/:id", isAdmin, authController.getUser);

//Get all users
router.get("/users", isAdmin, authController.getAllUsers);

//Activate code
router.post("/activate-code", isAuth, authController.activateCode);

//Generate code
router.post("/code", isAdmin, authController.generateCode);

module.exports = router;
