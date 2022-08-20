import dotenv from "dotenv";
dotenv.config();

const admin_auth = {
	host: process.env.AWS_DB_URL,
	user: process.env.AWS_DB_USERNAME,
	password: `${process.env.AWS_DB_PASSWORD}`,
	database: process.env.AWS_DB_DATABASE,
	port: 5432,
	dialect: "postgres",
};

export default admin_auth;
