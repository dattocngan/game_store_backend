const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		sex: {
			type: Number,
			default: 0,
		},
		birthday: {
			type: Date,
			default: null,
		},
		address: {
			type: String,
			default: null,
		},
		budget: {
			type: Number,
			default: 0,
		},
		role: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
