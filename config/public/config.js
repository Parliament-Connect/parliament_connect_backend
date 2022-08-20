import dotenv from "dotenv";
dotenv.config();

const parliament_auth = {
	host: process.env.AWS_DB_URL,
	port: process.env.DB_PORT,
	user: process.env.AWS_DB_USERNAME,
	password: `${process.env.AWS_DB_PASSWORD}`,
	database: process.env.AWS_DB_DATABASE,
};

const dialect = "postgres";
const schema = "public";
export { dialect, schema };
export default parliament_auth;
