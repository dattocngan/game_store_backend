const express = require("express");

const router = express.Router();
const multer = require("multer");

const gameController = require("../../controllers/game.controller");
const isAdmin = require("../../middlewares/is-admin");
const isAuth = require("../../middlewares/is-auth");

const {
  configFilterFileUpload,
  configStorage,
} = require("../../helpers/upload");

const upload = multer({
  storage: configStorage(),
  fileFilter: configFilterFileUpload(),
});

// Get all games
router.get("/", gameController.getGames);

//Get all games in cart
router.get("/cart", isAuth, gameController.getGamesInCart);

//Get all games in wishlist
router.get("/wishlist", isAuth, gameController.getGamesInWishList);

// Get game by id
router.get("/:id", gameController.getGame);

// Create new game
router.post(
  "/",
  isAdmin,
  upload.fields([
    {
      name: "feature_image",
      maxCount: 1,
    },
    {
      name: "images",
    },
  ]),
  async (req, res, next) => {
    res.locals.feature_image = req.files.feature_image[0];
    res.locals.images = req.files.images;
    next();
  },
  gameController.createGame,
);

// Edit game
router.put(
  "/:id",
  isAdmin,
  upload.fields([
    {
      name: "feature_image",
      maxCount: 1,
    },
    {
      name: "images",
    },
  ]),
  async (req, res, next) => {
    if (Object.keys(req.files).length > 0) {
      if (req.files.feature_image) {
        res.locals.feature_image = req.files.feature_image[0];
      }

      if (req.files.images && req.files.images.length > 0) {
        res.locals.images = req.files.images;
      }
    }

    next();
  },
  gameController.editGame,
);

// Delete game
router.delete("/:id", isAdmin, gameController.deleteGame);

//Add or remove game to cart
router.post("/:id/cart", isAuth, gameController.addOrRemoveGameOfCart);

//Add or remove game to wishlist
router.post("/:id/wishlist", isAuth, gameController.addOrRemoveGameOfWishList);

//Purchase game
router.post("/purchase", isAuth, gameController.purchaseGame);

module.exports = router;
