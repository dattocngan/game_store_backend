require("dotenv/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const codeGenerator = require("otp-generator");

const User = require("../models/user");
const Code = require("../models/code");

//Create new user
exports.signup = async (req, res, next) => {
	try {
		const { username, password, name } = req.body;

		if (password.length < 8) {
			const error = new Error("Password must have min length 8!");
			error.statusCode = 403;
			throw error;
		}

		const user = await User.findOne({ username: username });

		if (user) {
			const error = new Error("Username has been taken!");
			error.statusCode = 403;
			throw error;
		}

		const hashedPw = await bcrypt.hash(password, 12);

		await User.create({
			username: username,
			password: hashedPw,
			name: name,
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

//Login user
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		if (password.length < 8) {
			const error = new Error("Password must have min length 8!");
			error.statusCode = 403;
			throw error;
		}

		const user = await User.findOne({ username: username });

		if (!user) {
			const error = new Error("Username cannot be found!");
			error.statusCode = 404;
			throw error;
		}

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			const error = new Error("Wrong password!");
			error.statusCode = 401;
			throw error;
		}

		const accessToken = jwt.sign(
			{
				userId: user._id,
				name: user.name,
				role: user.role,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "1h" }
		);

		res.status(200).json({
			token: accessToken,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

//Get user
exports.getUser = async (req, res, next) => {
	try {
		const { password, _id, createdAt, updatedAt, __v, ...user } = JSON.parse(
			JSON.stringify(req.user)
		);
		res.status(200).json({
			user: user,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

//Edit user
exports.editUser = async (req, res, next) => {
	try {
		const { name, birthday, sex, oldPassword, newPassword } = req.body;
		const user = req.user;

		user.name = name || user.name;
		user.birthday = birthday || user.birthday;
		user.sex = sex !== undefined ? sex : user.sex;

		if (oldPassword && newPassword) {
			if (oldPassword.length < 8 || newPassword.length < 8) {
				const error = new Error("Password must have min length 8");
				error.statusCode = 403;
				throw error;
			}
			const isEqual = await bcrypt.compare(oldPassword, user.password);

			if (!isEqual) {
				const error = new Error("Wrong password!");
				error.statusCode = 403;
				throw error;
			}

			if (oldPassword === newPassword) {
				const error = new Error("Try another new password!");
				error.statusCode = 403;
				throw error;
			}

			const hashedPw = await bcrypt.hash(newPassword, 12);

			user.password = hashedPw;
		}

		await user.save();

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

//Generate code
exports.generateCode = async (req, res, next) => {
	try {
		const codes = [];
		let expiredTime = new Date();
		expiredTime.setDate(expiredTime.getDate() + 1);

		for (let i = 0; i < 20; i++) {
			const code = codeGenerator.generate(6, {
				digits: true,
				lowerCaseAlphabets: false,
				upperCaseAlphabets: false,
				specialChars: false,
			});

			codes.push({
				code: code,
				expired_time: expiredTime,
			});
		}

		await Code.insertMany(codes);

		res.status(201).json({
			message: "Generated codes successfully!",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

//Activate code
exports.activateCode = async (req, res, next) => {
	try {
		const { code } = req.body;

		const codeDb = await Code.findOne({ code: code });

		if (!codeDb) {
			const error = new Error(`Code isn't existed!`);
			error.statusCode = 404;
			throw error;
		}

		if (codeDb.is_activated) {
			const error = new Error(`Code was used!`);
			error.statusCode = 403;
			throw error;
		}

		if (codeDb.expired_time < new Date()) {
			const error = new Error(`Code was used!`);
			error.statusCode = 403;
			throw error;
		}

		res.status(201).json({
			message: "Generate codes successfully!",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
