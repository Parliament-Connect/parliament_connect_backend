import models from "../../models/index.js";
import objectUtils from "../../utils/object.utils.js";
import responseHandler from "./responseHandler.js";
import termChecker from "../../utils/terms.utils.js";

const uploadQuestion = async (req, res) => {
	const { question, sabhaName, version, mp_id, ministry_id } = req.body;

	const questionManager = models.pq;

	// Missing params from body
	const missing = objectUtils.findMissing({
		question,
		sabhaName,
		version,
		mp_id,
		ministry_id,
	});

	// If missing params, return error
	responseHandler.errorEmpty(res, missing);

	const sabha = termChecker.isValidHouseName(sabhaName);
	responseHandler.errorInvalidSabhaName(res, sabha);

	try {
		const result = await questionManager.createQuestion(
			question,
			sabha,
			version,
			mp_id,
			ministry_id
		);
		responseHandler.sendResponse(res, result, 201);
	} catch (err) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getQuestionById = async (req, res) => {
	const { qid } = req.body;

	const questionManager = models.pq;

	try {
		const result = await questionManager.getQuestionById(qid);
		// If all is good, return success message with status code 201
		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		return res.status(500).json({
			// if error found at this point, return internal server error
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const answerQuestion = async (req, res) => {
	const { qid, sabhaName, version, answer } = req.body;

	const questionManager = models.pq;

	// Missing params from body
	const missing = objectUtils.findMissing({
		qid,
		answer,
		sabhaName,
		version,
	});
	// If missing params, return error
	responseHandler.errorEmpty(res, missing);

	const sabha = termChecker.isValidHouseName(sabhaName);
	responseHandler.errorInvalidSabhaName(res, sabha);

	try {
		const result = await questionManager.answerQuestion(
			qid,
			answer,
			sabha,
			version
		);
		// If all is good, return success message with status code 201
		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		return res.status(500).json({
			// if error found at this point, return internal server error
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getRecentQuestions = async (req, res) => {
	const questionManager = models.pq;

	try {
		const result = await questionManager.getRecentQuestions();

		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		return res.status(500).json({
			// if error found at this point, return internal server error
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getQuestionsByQuery = async (req, res) => {
	// console.log(req.query.text);
	// return res.status(200).send();
	const { text } = req.query;
	const questionManager = models.pq;

	try {
		const result = await questionManager.getQuestionsByQuery(text);

		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		return res.status(500).json({
			// if error found at this point, return internal server error
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getQuestionByIdAndSabhaVersion = async (req, res) => {
	const { qid, sabhaName, version } = req.body;

	const questionManager = models.pq;

	// Missing params from body
	const missing = objectUtils.findMissing({ qid, sabhaName, version });

	// If missing params, return error
	responseHandler.errorEmpty(res, missing);

	const sabha = termChecker.isValidHouseName(sabhaName);
	responseHandler.errorInvalidSabhaName(res, sabha);

	try {
		const result = await questionManager.getQuestionByIdAndSabhaVersion(
			qid,
			sabha,
			version
		);

		responseHandler.sendResponse(res, result, 200);
	} catch (err) {
		return res.status(500).json({
			// if error found at this point, return internal server error
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

export default {
	uploadQuestion,
	getQuestionById,
	answerQuestion,
	getQuestionByIdAndSabhaVersion,
	getRecentQuestions,
	getQuestionsByQuery,
};
