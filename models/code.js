const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const codeSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
		expired_time: {
			type: Date,
			required: true,
		},
		is_activated: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Code", codeSchema);
