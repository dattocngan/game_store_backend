require("dotenv/config");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports = async (req, res, next) => {
	try {
		const authHeader = req.get("Authorization");
		if (!authHeader) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}
		const token = req.get("Authorization").split(" ")[1];
		let decodedToken;
		try {
			decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
		} catch (err) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}
		if (!decodedToken) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}

		if (decodedToken.role !== 1) {
			const error = new Error("Not authorized.");
			error.statusCode = 403;
			throw error;
		}
		const user = await User.findOne({ _id: decodedToken.userId });
		req.user = user;
		next();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
