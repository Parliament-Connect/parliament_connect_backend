import { models } from "../../models/admin.js";
import { Op } from "sequelize";

const getAllUsers = async (req, res) => {
	try {
		const User = models.direct_auth; // direct_auth model
		const users = await User.findAll({
			attributes: ["uname", "roles", "reference_id"],
		});
		return res.status(200).json({
			status: "success",
			users,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const User = models.direct_auth; // direct_auth model
		const { role, ref_id } = req.body;
		const user = await User.findAll({
			where: { reference_id: ref_id, roles: { [Op.contains]: [role] } },
		});
		if (user.length === 0) {
			return res.status(400).json({
				status: "error",
				message: "User not found",
			});
		}
		await User.destroy({
			where: { reference_id: ref_id, roles: { [Op.contains]: [role] } },
		});
		return res.status(200).json({
			status: "success",
			message: "User deleted",
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};
export { getAllUsers, deleteUser };
