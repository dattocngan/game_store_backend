const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		id: false,
	}
);

categorySchema.virtual("games", {
	ref: "Game",
	localField: "_id",
	foreignField: "category",
});

module.exports = mongoose.model("Category", categorySchema);
