import objectUtils from "../../utils/object.utils.js";
import termChecker from "../../utils/terms.utils.js";
import errorResponse from "./responseHandler.js";
import models from "../../models/index.js";
import responseHandler from "./responseHandler.js";

const registerMp = async (req, res) => {
	const {
		mp_id,
		name,
		ismp,
		party_name,
		sabha,
		sabha_version,
		constituency,
		created_at,
	} = req.body;

	const mpManager = models.mp;

	// Missing params from body
	const missing = objectUtils.findMissing({
		mp_id,
		name,
		ismp,
		party_name,
		sabha,
		sabha_version,
		constituency,
		created_at,
	});
	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// sabha name validation
	let sabhaName = termChecker.isValidHouseName(sabha);
	errorResponse.errorInvalidSabhaName(res, sabhaName);

	// if mp already exists, return error message and status code 400
	const mpExists = mpManager.getMpById(mp_id);
	if (mpExists.status === "success") {
		return res.status(400).json({
			status: "error",
			message: "MP already exists",
		});
	}

	// create a new mp with the given details
	const result = await mpManager.createMp(
		mp_id,
		name,
		ismp,
		party_name,
		sabhaName,
		sabha_version,
		constituency,
		created_at
	);
	console.log(result);
	// If all is good, return success message with status code 201
	responseHandler.sendResponse(res, result, 201);
};

// delete an MP by mp_id
const deleteMp = async (req, res) => {
	const { mp_id } = req.body;

	const mpManager = models.mp;

	// Missing params from body
	const missing = objectUtils.findMissing({ mp_id });

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// if mp does not exist, return error message and status code 400
	const mpExists = mpManager.getMpById(mp_id);
	if (mpExists.status === "error") {
		return res.status(400).json({
			status: "error",
			message: "MP does not exist",
		});
	}

	// delete the mp with the given id
	const result = await mpManager.deleteMp(mp_id);
	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, result, 200);
};

// update an MP by mp_id
const updateMp = async (req, res) => {
	// noinspection DuplicatedCode
	const { mp_id, name, ismp, party, sabhaName, sabha_version, constituency } =
		req.body;

	const mpManager = models.mp;

	// Missing params from body
	const missing = objectUtils.findMissing({
		mp_id,
		name,
		ismp,
		party,
		sabhaName,
		sabha_version,
		constituency,
	});

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// sabha name validation
	const sabha = termChecker.isValidHouseName(sabhaName);
	errorResponse.errorInvalidSabhaName(res, sabha);

	// if mp does not exist, return error message and status code 400
	const mpExists = this.getMpById(mp_id);
	if (mpExists.status === "error") {
		return res.status(400).json({
			status: "error",
			message: "MP does not exist",
		});
	}

	// update the mp with the given id
	const result = await mpManager.updateMp(
		mp_id,
		name,
		ismp,
		party,
		sabha,
		sabha_version,
		constituency
	);
	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, result, 200);
};

// update an MP by mp_id for selected fields
const updateMpWithSelectedAttributes = async (req, res) => {
	const { mp_id, name, party, sabhaName, sabha_version, constituency } =
		req.body;

	const mpManager = models.mp;

	// Missing params from body
	const filteredAttributes = objectUtils.filterNonEmpty({
		mp_id,
		name,
		party,
		sabhaName,
		sabha_version,
		constituency,
	});

	// If missing params, return error
	errorResponse.errorEmpty(res, { mp_id });

	let sabha = null;
	if (sabhaName) {
		// sabha name validation
		sabha = termChecker.isValidHouseName(sabhaName);
		errorResponse.errorInvalidSabhaName(res, sabha);
	}

	// if mp does not exist, return error message and status code 400
	const mpExists = this.getMpById(mp_id);
	if (mpExists.status === "error") {
		return res.status(400).json({
			status: "error",
			message: "MP does not exist",
		});
	}

	// update the mp with the given id
	const result = await mpManager.updateMpByAttributes(filteredAttributes);
	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, result, 200);
};

const getMpById = async (req, res) => {
	const { mp_id } = req.body;

	const mpManager = models.mp;

	// Missing params from body
	const missing = objectUtils.findMissing({ mp_id });

	// If missing params, return error
	errorResponse.errorEmpty(res, missing);

	// if mp does not exist, return error message and status code 400
	const mpExists = await mpManager.getMpById(mp_id);
	responseHandler.sendResponse(res, mpExists, 200);
};

const getAllMps = async (req, res) => {
	const mpManager = models.mp;

	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, await mpManager.getAllMps(), 200);
};

const getAllMpNames = async (req, res) => {
	const mpManager = models.mp;

	// If all is good, return success message with status code 200
	responseHandler.sendResponse(res, await mpManager.getAllMpNames(), 200);
}

export default {
	registerMp,
	deleteMp,
	updateMp,
	updateMpWithSelectedAttributes,
	getMpById,
	getAllMps,
	getAllMpNames,
};
