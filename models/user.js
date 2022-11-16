const mongoose = require("mongoose");
const FKHelper = require("../helpers/mongo/foreign-key-helper");

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
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
        validate: {
          isAsync: true,
          validator: function (v) {
            return FKHelper(mongoose.model("Game"), v);
          },
          message: `Game doesn't exist`,
        },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
        validate: {
          isAsync: true,
          validator: function (v) {
            return FKHelper(mongoose.model("Game"), v);
          },
          message: `Game doesn't exist`,
        },
      },
    ],
    games_bought: [
      {
        game: {
          type: Schema.Types.ObjectId,
          ref: "Game",
          validate: {
            isAsync: true,
            validator: function (v) {
              return FKHelper(mongoose.model("Game"), v);
            },
            message: `Game doesn't exist`,
          },
        },
        date_bought: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
