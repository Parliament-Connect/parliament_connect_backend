import objectUtils from "../../utils/object.utils.js";
import termChecker from "../../utils/terms.utils.js";
import models from "../../models/index.js";
import responseHandler from "./responseHandler.js";

// create a new parliament and its version
const createParliament = async (req, res) => {
	const { sabha, version } = req.body;

	const parliamentManager = models.parliamentManager;

	// Missing params from body
	const missing = objectUtils.findMissing({ sabha, version });
	responseHandler.errorEmpty(res, missing);

	// sabha name validation
	const schemaHouse = termChecker.isValidHouseName(sabha);
	responseHandler.errorInvalidSabhaName(res, schemaHouse);

	try {
		// If all is good, create parliament and return status code 201
		const result = await parliamentManager.createNewSabhaVersion(
			schemaHouse,
			version
		);
		responseHandler.sendResponse(res, result, 201);
	} catch (error) {
		// If error, return error message and status code 500
		res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: error.message,
		});
	}
};

const deleteParliament = async (req, res) => {
	// house and version are required
	const { sabha, version } = req.body;

	const parliamentManager = models.parliamentManager;

	// Missing params from body
	const missing = objectUtils.findMissing({ sabha, version });
	responseHandler.errorEmpty(res, missing);

	// house name validation
	const tableName = termChecker.isValidHouseName(sabha);
	responseHandler.errorInvalidSabhaName(res, tableName);

	try {
		const deleteVersion = await parliamentManager.deleteSabhaVersion(
			tableName,
			version
		);
		// If all is good, delete parliament and return status code 201
		responseHandler.sendResponse(res, deleteVersion, 200);
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error.stack);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// set the current parliament sabha and its version
const setCurrentParliamentVersion = async (req, res) => {
	const { sabha, version } = req.body;

	const parliamentManager = models.parliamentManager;

	// Missing params from body
	const missing = objectUtils.findMissing({ sabha, version });
	responseHandler.errorEmpty(res, missing);

	// house name validation
	const tableName = termChecker.isValidHouseName(sabha);
	responseHandler.errorInvalidSabhaName(res, tableName);

	try {
		const setCurrentVersion =
			await parliamentManager.setCurrentSabhaVersion(tableName, version);
		responseHandler.sendResponse(res, setCurrentVersion, 200);
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error.stack);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

const getCurrentParliamentVersion = async (req, res) => {
	const parliamentManager = models.parliamentManager;

	try {
		const currentVersion = await parliamentManager.getCurrentSabhaVersion();
		responseHandler.sendResponse(res, currentVersion, 200);
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error.stack);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
}

export default {
	createParliament,
	deleteParliament,
	setCurrentParliamentVersion,
	getCurrentParliamentVersion
};
