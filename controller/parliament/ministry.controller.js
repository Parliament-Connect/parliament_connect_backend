import models from "../../models/index.js";
import objectUtils from "../../utils/object.utils.js";
import errorResponse from "./responseHandler.js";
import responseHandler from "./responseHandler.js";

// create ministry with the given details
const registerMinistry = async (req, res) => {
	const { name, minister, group, mp_ref } = req.body;

	const ministryManager = models.ministry;

	// Missing params from body
	const missing = objectUtils.findMissing({
		name,
		minister,
		group,
	});

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	try {
		if (!mp_ref) {
			// create a new ministry with the given details
			const result = await ministryManager.createMinistry(
				name,
				group,
				minister
			);
			// If all is good, return success message with status code 201
			return res.status(201).json({
				...result,
			});
		} else {
			const result = await ministryManager.createMinistryWithMp_ref(
				name,
				minister,
				group,
				mp_ref
			);
			responseHandler.sendResponse(res, result, 201);
		}
	} catch (err) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}

	// If all is good, return success message with status code 201
};

// get ministry by mid
const getMinistryById = async (req, res) => {
	const { mid } = req.body;

	const ministryManager = models.ministry;

	// Missing params from body
	const missing = objectUtils.findMissing({ mid });

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// if ministry does not exist, return error message and status code 400
	const ministryExists = ministryManager.getMinistryById(mid);
	if (ministryExists.status === "error") {
		return res.status(400).json({
			status: "error",
			message: "Ministry does not exist",
		});
	}

	try {
		// get the ministry with the given id
		const result = await ministryManager.getMinistryById(mid);
		// If all is good, return success message with status code 200
		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		// At this point an unknown server error has occurred
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

// delete ministry by mid
const deleteMinistry = async (req, res) => {
	const { mid } = req.body;

	const ministryManager = models.ministry;

	// Missing params from body
	const missing = objectUtils.findMissing({ mid });

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// if ministry does not exist, return error message and status code 400
	const ministryExists = ministryManager.getMinistryById(mid);
	if (ministryExists.status === "error") {
		return res.status(400).json({
			status: "error",
			message: "Ministry does not exist",
		});
	}

	// delete the ministry with the given id
	const result = await ministryManager.deleteMinistryById(mid);
	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, result, 200);
};

const getAllMinistries = async (req, res) => {
	const ministryManager = models.ministry;

	// get all ministries
	const result = await ministryManager.getAllMinistries();
	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, result, 200);
};

export default {
	registerMinistry,
	getMinistryById,
	deleteMinistry,
	getAllMinistries,
};
