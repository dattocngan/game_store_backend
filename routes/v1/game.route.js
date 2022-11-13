const express = require("express");

const router = express.Router();

const gameController = require("../../controllers/game.controller");
const isAdmin = require("../../middlewares/is-admin");

// Get all objectives
router.get("/", gameController.getGames);

// //Get objective by id
router.get("/:id", gameController.getGame);

// //Create new objective
router.post("/", isAdmin, gameController.createGame);

// //Edit objective
router.put("/:id", isAdmin, gameController.editGame);

// //Delete objective
router.delete("/:id", isAdmin, gameController.deleteGame);

module.exports = router;
