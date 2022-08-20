import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import Router from "./routes/index.js"; // Load routes
import db from "./models/admin.js"; // Load models

const corsOptions = {
	origin: ["http://0.0.0.0:3000", "http://localhost:3000"],
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

dotenv.config(); // Load .env file

const app = express(); // Create express app
app.use(cors(corsOptions));

const port = process.env.PORT || 5500;

// Middleware utils
app.use(bodyParser.json());
app.use(cookieParser());

// Custom route middleware
app.use("/api", Router);

app.use((req, res) => {
	res.status(404).json({
		status: "error",
		message: `Invalid ${req.method} request to ${req.originalUrl}`,
	});
});

db.sync() // Sync database - connect to postgresql
	.then(() => {
		// If success, start server
		app.listen(port, process.env.HOSTNAME, () => {
			console.log(
				"Server running on " + process.env.HOSTNAME + ":" + port
			);
		});
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		// If error, log error
		console.error("Unable to connect to the database: " + err);
		if (err.parent.code === "3F000") {
			console.log("Schema does not exist.");
		}
	});
