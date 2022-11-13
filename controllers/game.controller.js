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

// //Get an game by id
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
			feature_image,
			images,
		} = req.body;

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
			feature_image,
			images,
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
		game.feature_image = feature_image || game.feature_image;
		game.recommend = recommend || game.recommend;

		if (images && images.length > 0) {
			images.forEach((image) => {
				game.images.push(image);
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

// //Delete game
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
