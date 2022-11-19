const mongoose = require("mongoose");
const game = require("../models/game");
const Game = require("../models/game");

// //Get all games
exports.getGames = async (req, res, next) => {
  try {
    const games = await Game.find().populate("category", "name");

    res.status(200).json({
      games,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get game by id
exports.getGame = async (req, res, next) => {
  try {
    const id = req.params.id;
    const game = await Game.findOne({
      _id: id,
    }).populate("category", "name");

    if (!game) {
      const error = new Error("Cannot find the game!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      game,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// //Create game
exports.createGame = async (req, res, next) => {
  try {
    const {
      name,
      category,
      developer,
      publisher,
      price,
      release_date,
      description,
      discount,
    } = req.body;

    const feature_image = res.locals.feature_image;

    const images = [];
    res.locals.images.forEach((image) => {
      images.push(image.key);
    });

    await Game.create({
      name,
      category,
      developer,
      publisher,
      price,
      release_date,
      description,
      discount,
      feature_image,
      images,
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

// //Edit game
exports.editGame = async (req, res, next) => {
  try {
    const id = req.params.id;
    const game = await Game.findOne({
      _id: id,
    });

    if (!game) {
      const error = new Error("Cannot find the game!");
      error.statusCode = 404;
      throw error;
    }

    const {
      name,
      category,
      developer,
      publisher,
      price,
      release_date,
      description,
      discount,
      recommend,
    } = req.body;

    game.name = name || game.name;
    game.category = category || game.category;
    game.developer = developer || game.developer;
    game.publisher = publisher || game.publisher;
    game.price = price || game.price;
    game.release_date = release_date || game.release_date;
    game.description = description || game.description;
    game.discount = discount || game.discount;
    game.recommend = recommend || game.recommend;

    if (res.locals.feature_image) {
      game.feature_image = res.locals.feature_image;
    }

    if (res.locals.images && res.locals.images.length > 0) {
      res.locals.images.forEach((image) => {
        game.images.push(image.key);
      });
    }

    await game.save();

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

// Delete game
exports.deleteGame = async (req, res, next) => {
  try {
    const id = req.params.id;
    const game = await Game.findOne({
      _id: id,
    });

    if (!game) {
      const error = new Error("Cannot find the game!");
      error.statusCode = 404;
      throw error;
    }

    await Game.findByIdAndDelete(id);

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

//Add or remove game to user's cart
exports.addOrRemoveGameOfCart = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = req.user;

    const index = user.cart.indexOf(id);

    if (index > -1) {
      user.cart.splice(index, 1);
    } else {
      user.cart.push(id);
    }

    await user.save();

    res.status(200).json({
      message: "Edit cart successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get all games in user's cart
exports.getGamesInCart = async (req, res, next) => {
  try {
    const user = req.user;
    const games = await Game.find({
      _id: { $in: user.cart },
    });

    res.status(200).json({
      games,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Add or remove game to user's wishlist
exports.addOrRemoveGameOfWishList = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = req.user;

    const index = user.wishlist.indexOf(id);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(id);
    }

    await user.save();

    res.status(200).json({
      message: "Edit wishlist successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get all games in user's cart
exports.getGamesInWishList = async (req, res, next) => {
  try {
    const user = req.user;
    const games = await Game.find({ _id: { $in: user.wishlist } });

    res.status(200).json({
      games,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Purchase game
exports.purchaseGame = async (req, res, next) => {
  try {
    const user = req.user;

    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      const error = new Error("No games in the cart!");
      error.statusCode = 404;
      throw error;
    }

    const games = await Game.find({ _id: { $in: cart } });

    if (!games.length) {
      const error = new Error("Invalid game!");
      error.statusCode = 403;
      throw error;
    }

    games.forEach((game) => {
      for (let i = 0; i < user.games_bought.length; i++) {
        const gameId = user.games_bought[i].game;
        if (gameId.toString() === game._id.toString()) {
          const error = new Error("Cannot buy bought game!");
          error.statusCode = 403;
          throw error;
        }
      }
    });

    let totalPrice = 0;

    games.forEach((game) => {
      totalPrice += (
        Math.round(game.price * (100 - game.discount)) / 100
      ).toFixed(2);
    });

    if (totalPrice > user.budget) {
      const error = new Error("Not enough money!");
      error.statusCode = 403;
      throw error;
    }

    games.forEach((game) => {
      game.downloaded_number++;
      game.save();
    });

    user.budget -= totalPrice;
    user.cart = [];

    games.forEach((game) => {
      user.games_bought.push({
        game: game,
        date_bought: new Date(),
      });
    });

    user.wishlist = user.wishlist.filter((value) => {
      let check = true;
      for (let i = 0; i < games.length; i++) {
        if (games[i]._id.toString() === value.toString()) {
          check = false;
          break;
        }
      }
      return check;
    });

    await user.save();

    res.status(200).json({
      message: "Purchase games successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Get all games bought
exports.getGamesBought = async (req, res, next) => {
  try {
    const user = req.user;

    const games = user.games_bought;

    for (let i = 0; i < games.length; i++) {
      const game = await Game.findById(games[i].game);
      games[i].game = game;
    }
    res.status(200).json({
      games,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
