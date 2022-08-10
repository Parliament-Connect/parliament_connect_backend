import objectUtils from "../../utils/object.utils.js";

const errorEmpty = (res, missing) => {
	if (!objectUtils.objectIsEmpty(missing)) {
		// If missing params, return error
		return res.status(400).json({
			status: "error",
			message: "Missing required fields",
			missing,
		});
	}
};

const errorInvalidSabhaName = (res, sabha) => {
	// sabha name validation
	if (!sabha) {
		// If house is not valid, return error
		return res.status(400).json({
			status: "error",
			message: "Invalid house",
		});
	}
};

const sendResponse = (res, body, successCode) => {
	if (body.status === "success") {
		return res.status(successCode).json({ ...body });
	} else {
		return res.status(400).json({ ...body });
	}
};

export default {
	errorEmpty,
	errorInvalidSabhaName,
	sendResponse,
};
