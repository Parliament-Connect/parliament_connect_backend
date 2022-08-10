import pg from "pg";
import { config } from "dotenv";
import publicDBConfig from "../public/config.js";

config();

// connect to the database
const pool = new pg.Pool(publicDBConfig);
const sabhaVersion = {};

pool.on("connect", () => {
	console.log("connected to the database");
});

pool.on("error", (err) => {
	console.log("Error connecting to the database", err);
});

pool.on("exit", () => {
	console.log("Exited from the database");
});

pool.on("disconnect", () => {
	console.log("Disconnected from the database");
});

export default pool;
