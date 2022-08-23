import axios from "axios";
import dotenv from "dotenv";
import models from "../../models/index.js";
import ObjectUtils from "../../utils/object.utils.js";
import objectUtils from "../../utils/object.utils.js";

dotenv.config();

// const API_URL = "http://43.205.203.124:80";
const API_URL = "http://13.233.174.140:80";
const INDEXER_SECRET = process.env.INDEXER_SECRET;

const create_index = async (req, res) => {
	const data = req.body;
	const payload = { ...data, SECRET_KEY: INDEXER_SECRET };
	console.log(payload);
	try {
		const result = await axios.post(API_URL + "/index", payload);
		if (result.data.status === "error") {
			return res.status(400).json({
				status: "error",
				message: "Bad Request",
				error: result.data.message,
			});
		}
		return res.status(201).json({
			status: "success",
			message: "Index created successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err,
		});
	}
};

const delete_index = async (req, res) => {
	const data = req.body;
	const payload = { ...data, SECRET_KEY: INDEXER_SECRET };
	try {
		const result = await axios.delete(API_URL + "/index", {
			data: payload,
		});
		if (result.data.status === "error") {
			return res.status(400).json({
				status: "error",
				message: "Bad Request",
				error: result.data.message,
			});
		}
		return res.status(201).json({
			status: "success",
			message: "Index deleted successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const upload_question = async (req, res) => {
	const mpManager = models.mp;
	const ministryManager = models.ministry;

	const mps = await mpManager.getAllMpNames();
	const ministries = await ministryManager.getAllMinistryNames();

	const data = req.body;

	const hasMp = mps.result.some(
		(mp) => mp.name.toUpperCase() === data.mp.toUpperCase()
	);
	const hasMinistry = ministries.message.some(
		(ministry) =>
			ministry.name.toUpperCase() === data.ministry.toUpperCase()
	);

	if (!hasMp) {
		return res.status(400).json({
			status: "error",
			message: "Bad Request",
			error: "MP not found",
		});
	}

	if (!hasMinistry) {
		return res.status(400).json({
			status: "error",
			message: "Bad Request",
			error: "Ministry not found",
		});
	}

	const payload = { ...data, SECRET_KEY: INDEXER_SECRET };
	try {
		const result = await axios.post(API_URL + "/question", payload);
		return res.status(201).json({
			status: "success",
			message: "Question uploaded successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getUserUnansweredQuestions = async (req, res) => {
	const { index } = req.body;
	let url = API_URL + "/get/questions/";
	if (req.user.role.includes("MP")) {
		url += "mp";
	} else {
		url += "ministry";
	}
	try {
		const result = await axios.get(
			`${url}/unanswered/${index}/${req.user.ref_id}`
		);
		return res.status(200).json({
			status: "success",
			message: "Unanswered questions retrieved successfully",
			questions: result.data,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const upload_answer = async (req, res) => {
	const { index, id, answer, styled_answer } = req.body;

	const question = await axios.get(
		API_URL + "/get/question/" + index + "/" + id
	);

	const missing = objectUtils.findMissing({
		index,
		id,
		answer,
		styled_answer,
	});
	if (!objectUtils.objectIsEmpty(missing)) {
		return res.status(400).json({
			status: "error",
			message: "Missing required fields",
			missing,
		});
	}
	let role = "";
	if (req.user.role.includes("MP")) {
		role = "mp";
	} else if (req.user.role.includes("Ministry")) {
		role = "ministry";
	}

	console.log(req.user);
	console.log(question.data._source[role]);

	if (req.user.uname !== question.data._source[role]) {
		return res.status(400).json({
			status: "error",
			message: "Bad Request",
			error: "You cannot answer this question",
		});
	}

	const payload = {
		id,
		index,
		answer,
		answer_styled: styled_answer,
		SECRET_KEY: INDEXER_SECRET,
	};
	try {
		const result = await axios.post(API_URL + "/answer", payload);
		return res.status(201).json({
			status: "success",
			message: "Answer uploaded successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getIndices = async (req, res) => {
	try {
		const result = await axios.get(API_URL + "/get/indices");
		return res.status(200).json({
			status: "success",
			message: "Indices retrieved successfully",
			indices: result.data.indices,
		});
	} catch (err) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

const getMPs = async (req, res) => {
	const data = req.body;
	try {
		const result = await axios.post(API_URL + "/mp", data);
		return res.status(200).json({
			status: "success",
			message: "MPs retrieved successfully",
			mps: result.data,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: err.message,
		});
	}
};

export default {
	create_index,
	delete_index,
	upload_question,
	getIndices,
	getMPs,
	upload_answer,
	getUserUnansweredQuestions,
};
