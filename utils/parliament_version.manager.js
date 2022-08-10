import publicConfig from "../config/public/config.js";
import pg from "pg";

// admin config for the database
const admin_config = {
	host: publicConfig.host,
	port: publicConfig.port,
	user: publicConfig.user,
	password: publicConfig.password,
	database: publicConfig.database,
};

// end the connection with the database
const endConnection = async (client) => {
	if (client) {
		try {
			await client.end();
		} catch (err) {
			console.error(
				"Error occurred while closing the database connection : " +
					err.stack
			);
		}
	}
};

// create a new parliament -> create a new schema in the database (parliament_connect)
const initSchema = async (house, version) => {
	const client = new pg.Client(admin_config);
	client.connect();

	// create a new schema with the name of the house and the version (Ex: lok)
	try {
		const schemaExist = await client.query(
			`SELECT * FROM information_schema.schemata WHERE schema_name = '${house}${version}';`
		);
		// if schema exists, return false
		if (schemaExist.rows.length > 0) {
			console.log("Schema already exists");
			await endConnection(client);
			return { status: "error", message: "Schema already exists" };
		}
		// if schema does not exist, create a new schema
		const res = await client.query(
			`CREATE SCHEMA IF NOT EXISTS ${house}${version};`
		);
		console.log(res);

		// adding a new entry in the parliament.house table with version and date started
		await addHouseEntry(house, version);

		await endConnection(client);
		return {
			status: "success",
			message: `${house} version - ${version} created successfully`,
		};
	} catch (err) {
		// if error, log error and return false with error message
		console.error(err.stack);
		await endConnection(client);
		return { status: "error", message: "Internal server error" };
	}
};

// add a new entry in the parliament.house table with version and date started
const addHouseEntry = async (house, version) => {
	const client = new pg.Client(admin_config);
	client.connect();

	// create a entry with the name of the house and the version (Ex: lok) in parliament.house table
	try {
		const versionExist = await client.query(
			`SELECT * FROM public.${house} WHERE version=${version};`
		);
		// if version exists, return false
		if (versionExist.rows.length > 0) {
			console.log("${house} version - ${version} already exists");
			await endConnection(client);
			return {
				status: "error",
				message: `${house} version - ${version} already exists`,
			};
		}

		// if version does not exist, create a new entry
		const res = await client.query(
			`INSERT INTO public.${house}(version) values(${version});`
		);
		console.log(res);

		await endConnection(client);
		return {
			// if success, log success and return true
			status: "success",
			message: `${house} version - ${version} created successfully`,
		};
	} catch (err) {
		// if error, log error and return false with error message
		console.error(err);
		await endConnection(client);
		return { status: "error", message: "Internal server error" };
	}
};

// set the current parliament_version in the database (parliament_connect) [Schema: parliament | Table: current_parliament_version]
const setCurrentVersion = async (house, version) => {
	const client = new pg.Client(admin_config);

	client.connect();

	try {
		// set the current parliament.parliament_version in the database
		const versionExist = await client.query(
			`SELECT COUNT(*) FROM public.${house} WHERE version = ${version};`
		);
		// if version does not exist, return false
		if (versionExist.rows[0].count === "0") {
			console.log("Version does not exist");
			await endConnection(client);
			return {
				status: "error",
				message: `Version-${version} does not exist for the house ${house}`,
			};
		}

		// if success, log success and return true
		const res = await client.query(
			`UPDATE public.current_house_version SET ${house}=${version} WHERE id=1;`
		);
		console.log(res);
		await endConnection(client);
		return {
			// if success, log success and return true
			status: "success",
			message: `${house} - version updated successfully with ${version}`,
		};
	} catch (err) {
		// if error, log error and return false
		console.error(err);
		await endConnection(client);
		return { status: "error", message: "Internal server error" };
	}
};

export default { initSchema, setCurrentVersion };
