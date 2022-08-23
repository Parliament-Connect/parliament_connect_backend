import { models } from "../../models/admin.js";
import { Op } from "sequelize";
import objectUtils from "../../utils/object.utils.js";
import direct_auth from "../../models/parliament_auth/parliament_direct.model.js";

const createPoll = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Poll = models.polls; // polls model
			const {
				question,
				description,
				optionsArray,
				expiryDate,
				expiryTime,
			} = req.body; // question, description, options, expiryDate and expiryTime are required
			console.log(req.body);

			// Missing params from body
			const missing = objectUtils.findMissing({
				question,
				description,
				optionsArray,
				expiryDate,
				expiryTime,
			});

			// If missing params, return error
			if (!objectUtils.objectIsEmpty(missing)) {
				return res.status(400).json({
					status: "error",
					message: "Missing required fields",
					missing,
				});
			}

			if (optionsArray.includes("")) {
				return res.status(400).json({
					status: "error",
					message: "Options cannot be empty",
				});
			}

			const options = optionsArray.map((option) => {
				return {
					option: option,
					votes: 0,
				};
			});

			// Create poll
			await Poll.create({
				question,
				description,
				options,
				expiryDate,
				expiryTime,
				parliamentAuthId: req.user.id,
			});
			return res.status(200).json({
				status: "success",
				message: "Poll created",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "Only MPs and Ministries can create polls",
		});
	}
};

const getAllUserPolls = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Poll = models.polls; // polls model
			const { page, limit } = req.body; // page and limit are optional
			const pageNumber = parseInt(page) || 1; // default page number is 1
			const limitNumber = parseInt(limit) || 10; // default limit is 10
			const offset = (pageNumber - 1) * limitNumber; // offset is the number of records to skip

			const pa_id = req.user.id;

			const polls = await Poll.findAll({
				offset,
				limit: limitNumber,
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: models.direct_auth,
						where: {
							id: pa_id,
						},
						attributes: ["id", "uname", "roles"],
					},
				],
			});
			return res.status(200).json({
				status: "success",
				message: "Polls retrieved",
				polls,
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "Only MPs and Ministries can get all polls",
		});
	}
};

const getPoll = async (req, res) => {
	try {
		const Poll = models.polls; // polls model
		const { id } = req.params; // id is required
		const poll = await Poll.findOne({
			where: { id },
		});
		if (!poll) {
			return res.status(400).json({
				status: "error",
				message: "Poll not found",
			});
		}
		return res.status(200).json({
			status: "success",
			message: "Poll retrieved",
			poll,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const updatePoll = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Poll = models.polls; // polls model
			const {
				id,
				question,
				description,
				optionsArray,
				expiryDate,
				expiryTime,
			} = req.body; // id, question, description, options, expiryDate and expiryTime are required
			const poll = await Poll.findOne({
				where: { id },
			});
			if (!poll) {
				return res.status(400).json({
					status: "error",
					message: "Poll not found",
				});
			}
			// Missing params from body
			const missing = objectUtils.findMissing({
				question,
				description,
				optionsArray,
				expiryDate,
				expiryTime,
			});

			// If missing params, return error
			if (!objectUtils.objectIsEmpty(missing)) {
				return res.status(400).json({
					status: "error",
					message: "Missing required fields",
					missing,
				});
			}
			if (optionsArray.includes("")) {
				return res.status(400).json({
					status: "error",
					message: "Options cannot be empty",
				});
			}
			const options = optionsArray.map((option) => {
				return {
					option: option,
					votes: 0,
				};
			});
			await poll.update({
				question,
				description,
				options,
				expiryDate,
				expiryTime,
			});
			return res.status(200).json({
				status: "success",
				message: "Poll updated",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	}
};

const vote = async (req, res) => {
	try {
		const Poll = models.polls; // polls model
		const { id, optionKey } = req.body; // option is required

		// Missing params from body
		const missing = objectUtils.findMissing({
			id,
			optionKey,
		});

		// If missing params, return error
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}

		const poll = await Poll.findOne({
			where: { id },
		});
		if (!poll) {
			return res.status(400).json({
				status: "error",
				message: "Poll not found",
			});
		}
		if (optionKey - 1 > poll.options.length - 1) {
			return res.status(400).json({
				status: "error",
				message: "Option not found",
			});
		}

		poll.options[optionKey - 1].votes++;

		console.log(poll.options);

		await Poll.update({ options: poll.options }, { where: { id } });

		return res.status(200).json({
			status: "success",
			message: "Vote recorded",
			poll,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const deletePoll = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Poll = models.polls; // polls model
			const { id } = req.body; // id is required
			const poll = await Poll.findOne({
				where: { id },
			});
			if (!poll) {
				return res.status(400).json({
					status: "error",
					message: "Poll not found",
				});
			}
			await Poll.destroy({
				where: { id },
			});
			return res.status(200).json({
				status: "success",
				message: "Poll deleted",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}
	}
};

export default {
	createPoll,
	getAllUserPolls,
	getPoll,
	vote,
	updatePoll,
	deletePoll,
};
