const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const FKHelper = require("../helpers/mongo/foreign-key-helper");

const Schema = mongoose.Schema;

const gameSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			validate: {
				isAsync: true,
				validator: function (v) {
					return FKHelper(mongoose.model("Category"), v);
				},
				message: `Category doesn't exist`,
			},
		},
		developer: {
			type: String,
			required: true,
		},
		publisher: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			default: 0,
		},
		release_date: {
			type: Date,
			default: null,
		},
		description: {
			type: String,
			required: true,
		},
		discount: {
			type: Number,
			default: 0,
			max: 100,
		},
		recommend: {
			type: Number,
			default: null,
		},
		feature_image: {
			type: String,
			required: true,
		},
		images: [],
		downloaded_number: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

gameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Game", gameSchema);
