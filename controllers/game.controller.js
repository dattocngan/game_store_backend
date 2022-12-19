require("dotenv/config");

const User = require("../models/user");
const Game = require("../models/game");
const jwt = require("jsonwebtoken");

// //Get all games
exports.getGames = async (req, res, next) => {
  try {
    let user = null;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedToken) {
        user = await User.findOne({ _id: decodedToken.userId });
      }
    }

    const games = await Game.find().populate("category", "name");

    for (let i = 0; i < games.length; i++) {
      games[i] = games[i].toObject();
      games[i].feature_image =
        process.env.DOMAIN_IMAGE + games[i].feature_image;
      games[i].download_link =
        process.env.DOMAIN_IMAGE +
        (games[i].download_link
          ? games[i].download_link
          : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
      games[i].images = games[i].images.map(
        (image) => process.env.DOMAIN_IMAGE + image,
      );
      let check = false;
      if (user) {
        for (let j = 0; j < user.games_bought.length; j++) {
          const gameBought = user.games_bought[j];
          if (gameBought.game.toString() === games[i]._id.toString()) {
            check = true;
            break;
          }
        }
      }
      if (!check) {
        delete games[i].is_installed;
        delete games[i].download_link;
      }
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

// Get top recommend games
exports.getRecommendGames = async (req, res, next) => {
  try {
    let user = null;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedToken) {
        user = await User.findOne({ _id: decodedToken.userId });
      }
    }

    const games = await Game.find({
      recommend: {
        $ne: null,
      },
    })
      .sort({ recommend: 1 })
      .limit(5)
      .populate("category", "name");

    for (let i = 0; i < games.length; i++) {
      games[i] = games[i].toObject();
      games[i].feature_image =
        process.env.DOMAIN_IMAGE + games[i].feature_image;
      games[i].download_link =
        process.env.DOMAIN_IMAGE +
        (games[i].download_link
          ? games[i].download_link
          : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
      games[i].images = games[i].images.map(
        (image) => process.env.DOMAIN_IMAGE + image,
      );
      let check = false;
      if (user) {
        for (let j = 0; j < user.games_bought.length; j++) {
          const gameBought = user.games_bought[j];
          if (gameBought.game.toString() === games[i]._id.toString()) {
            check = true;
            break;
          }
        }
      }
      if (!check) {
        delete games[i].is_installed;
        delete games[i].download_link;
      }
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

// Get most downloaded games
exports.getMostDownloadedGames = async (req, res, next) => {
  try {
    let user = null;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedToken) {
        user = await User.findOne({ _id: decodedToken.userId });
      }
    }

    const games = await Game.find()
      .sort({ downloaded_number: -1 })
      .limit(5)
      .populate("category", "name");

    for (let i = 0; i < games.length; i++) {
      games[i] = games[i].toObject();
      games[i].feature_image =
        process.env.DOMAIN_IMAGE + games[i].feature_image;
      games[i].download_link =
        process.env.DOMAIN_IMAGE +
        (games[i].download_link
          ? games[i].download_link
          : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
      games[i].images = games[i].images.map(
        (image) => process.env.DOMAIN_IMAGE + image,
      );
      let check = false;
      if (user) {
        for (let j = 0; j < user.games_bought.length; j++) {
          const gameBought = user.games_bought[j];
          if (gameBought.game.toString() === games[i]._id.toString()) {
            check = true;
            break;
          }
        }
      }
      if (!check) {
        delete games[i].is_installed;
        delete games[i].download_link;
      }
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

// Get top 5 sale games
exports.getSaleGames = async (req, res, next) => {
  try {
    let user = null;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedToken) {
        user = await User.findOne({ _id: decodedToken.userId });
      }
    }

    const games = await Game.find()
      .sort({ discount: -1 })
      .limit(5)
      .populate("category", "name");

    for (let i = 0; i < games.length; i++) {
      games[i] = games[i].toObject();
      games[i].feature_image =
        process.env.DOMAIN_IMAGE + games[i].feature_image;
      games[i].download_link =
        process.env.DOMAIN_IMAGE +
        (games[i].download_link
          ? games[i].download_link
          : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
      games[i].images = games[i].images.map(
        (image) => process.env.DOMAIN_IMAGE + image,
      );
      let check = false;
      if (user) {
        for (let j = 0; j < user.games_bought.length; j++) {
          const gameBought = user.games_bought[j];
          if (gameBought.game.toString() === games[i]._id.toString()) {
            check = true;
            break;
          }
        }
      }
      if (!check) {
        delete games[i].is_installed;
        delete games[i].download_link;
      }
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

//Get game by id
exports.getGame = async (req, res, next) => {
  try {
    const id = req.params.id;

    let user = null;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedToken) {
        user = await User.findOne({ _id: decodedToken.userId });
      }
    }

    let game = await Game.findOne({
      _id: id,
    }).populate("category", "name");

    if (!game) {
      const error = new Error("Cannot find the game!");
      error.statusCode = 404;
      throw error;
    }
    game = game.toObject();
    game.feature_image = process.env.DOMAIN_IMAGE + game.feature_image;
    game.download_link =
      process.env.DOMAIN_IMAGE +
      (game.download_link
        ? game.download_link
        : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
    game.images = game.images.map((image) => process.env.DOMAIN_IMAGE + image);
    let check = false;
    if (user) {
      for (let j = 0; j < user.games_bought.length; j++) {
        const gameBought = user.games_bought[j];
        if (gameBought.game.toString() === game._id.toString()) {
          check = true;
          break;
        }
      }
    }
    if (!check) {
      delete game.is_installed;
      delete game.download_link;
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
    const download_link = res.locals.download_link;
    console.log(download_link);

    const images = [];
    res.locals.images?.forEach((image) => {
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
      download_link,
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

    game.name = name;
    game.category = category;
    game.developer = developer;
    game.publisher = publisher;
    game.price = price;
    game.release_date = release_date;
    game.description = description;
    game.discount = discount;
    game.recommend = recommend !== "null" ? recommend : game.recommend;

    if (res.locals.feature_image) {
      game.feature_image = res.locals.feature_image;
    }

    if (res.locals.download_link) {
      game.download_link = res.locals.download_link;
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

    const users = await User.find();

    users.forEach((user) => {
      let index;
      index = user.cart.indexOf(id);
      if (index > -1) {
        user.cart.splice(index, 1);
      }
      index = user.wishlist.indexOf(id);
      if (index > -1) {
        user.wishlist.splice(index, 1);
      }
      for (let i = 0; i < user.games_bought.length; i++) {
        if (user.games_bought[i].game.toString() === id.toString()) {
          user.games_bought.splice(i, 1);
          break;
        }
      }
      user.save();
    });

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
    })
      .select("-is_installed -link")
      .populate("category", "name");

    games.forEach((game) => {
      game.feature_image = process.env.DOMAIN_IMAGE + game.feature_image;
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
    const games = await Game.find({ _id: { $in: user.wishlist } }).populate(
      "category",
      "name",
    );

    games.forEach((game) => {
      game.feature_image = process.env.DOMAIN_IMAGE + game.feature_image;
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
      const game = await Game.findById(games[i].game).populate(
        "category",
        "name",
      );
      game.feature_image = process.env.DOMAIN_IMAGE + game.feature_image;
      game.download_link =
        process.env.DOMAIN_IMAGE +
        (games[i].download_link
          ? games[i].download_link
          : "applications/2b228be0-a0e9-419d-8f82-96fea78649ce.apk");
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

//Install or uninstall game
exports.changeInstallStatusGame = async (req, res, next) => {
  try {
    const user = req.user;
    const gameId = req.params.id;

    const games = user.games_bought;
    let check = false;
    for (let i = 0; i < games.length; i++) {
      if (games[i].game.toString() === gameId.toString()) {
        check = true;
        break;
      }
    }
    if (!check) {
      const error = new Error(`Game hasn't been purchased yet!`);
      error.statusCode = 403;
      throw error;
    }
    const game = await Game.findById(gameId);
    game.is_installed = !game.is_installed;
    game.save();

    res.status(201).json({
      message: "Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
