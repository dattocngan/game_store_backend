require("dotenv/config");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

//CORS
app.use(cors());

const v1Routes = require("./routes/v1");

app.use("/api/v1", v1Routes);

//Error handling
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({
		message: message,
		data: data,
	});
});

const MONGODB_URL = process.env.MONGODB_URL;
const port = process.env.PORT || 8080;

mongoose
	.connect(MONGODB_URL)
	.then((result) => {
		console.log("Connected to Database!");
		app.listen(port);
	})
	.catch((err) => {
		console.log(err);
	});
