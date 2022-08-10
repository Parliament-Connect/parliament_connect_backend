import dotenv from "dotenv";
dotenv.config();

const parliament_auth = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_PC_USER,
	password: `${process.env.DB_PC_PASSWORD}`,
	database: process.env.DB_PC_NAME,
};

const dialect = "postgres";
const schema = "public";
export { dialect, schema };
export default parliament_auth;
