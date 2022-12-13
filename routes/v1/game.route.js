const express = require("express");

const router = express.Router();
const multer = require("multer");

const gameController = require("../../controllers/game.controller");
const isAdmin = require("../../middlewares/is-admin");
const isAuth = require("../../middlewares/is-auth");
const { s3Upload } = require("../../helpers/s3");

const { configFilterFileUpload } = require("../../helpers/upload");

const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: configFilterFileUpload(),
});

// Get all games
router.get("/", gameController.getGames);

// Get top 5 recommend games
router.get("/recommend", gameController.getRecommendGames);

// Get top 5 most downloaded games
router.get("/most-downloaded", gameController.getMostDownloadedGames);

// Get top 5 sale games
router.get("/sale", gameController.getSaleGames);

//Get all games bought
router.get("/bought", isAuth, gameController.getGamesBought);

//Get all games in cart
router.get("/cart", isAuth, gameController.getGamesInCart);

//Get all games in wishlist
router.get("/wishlist", isAuth, gameController.getGamesInWishList);

//Purchase game
router.post("/purchase", isAuth, gameController.purchaseGame);

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
    {
      name: "download_link",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    try {
      const featureResult = await s3Upload(req.files.feature_image);
      res.locals.feature_image = featureResult[0].key;
      const downloadLink = await s3Upload(req.files.download_link);
      res.locals.download_link = downloadLink[0].Key;
      if (req.files.images && req.files.images.length) {
        const imagesResult = await s3Upload(req.files.images);
        res.locals.images = imagesResult;
      }
      next();
    } catch (err) {
      next(err);
    }
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
    {
      name: "download_link",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    try {
      if (Object.keys(req.files).length > 0) {
        if (req.files.feature_image) {
          const featureResult = await s3Upload(req.files.feature_image);
          res.locals.feature_image = featureResult[0].key;
        }

        if (req.files.download_link) {
          const downloadLink = await s3Upload(req.files.download_link);
          res.locals.download_link = downloadLink[0].key;
        }

        if (req.files.images && req.files.images.length) {
          const imagesResult = await s3Upload(req.files.images);
          res.locals.images = imagesResult;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  },
  gameController.editGame,
);

// Delete game
router.delete("/:id", isAdmin, gameController.deleteGame);

//Add or remove game to cart
router.post("/:id/cart", isAuth, gameController.addOrRemoveGameOfCart);

//Add or remove game to wishlist
router.post("/:id/wishlist", isAuth, gameController.addOrRemoveGameOfWishList);

//Install or uninstall game
router.put(
  "/:id/change-install-status-game",
  isAuth,
  gameController.changeInstallStatusGame,
);

module.exports = router;
