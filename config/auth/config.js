import dotenv from "dotenv";
dotenv.config();

const admin_auth = {
	host: process.env.DB_HOST,
	user: process.env.DB_PA_USER,
	password: "admin",
	database: process.env.DB_PA_NAME,
	port: 5432,
	dialect: "postgres",
};

export default { admin_auth };
