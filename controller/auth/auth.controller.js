import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { models } from "../../models/admin.js";
import objectUtils from "../../utils/object.utils.js";
import { Op } from "sequelize";
import CookieSession from "cookie-session";

// admin signup authentication controller
const admin_signup = async (req, res) => {
	try {
		const User = models.direct_auth; // direct_auth model

		const { uname, password, role, ref_id } = req.body; // id, uname and password are required
		console.log(req.body);

		// Missing params from body
		const missing = objectUtils.findMissing({
			uname,
			password,
			role,
			ref_id,
		});
		// If missing params, return error
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}

		let userExist;

		if (role === "admin") {
			// Check if user already exists
			userExist = await User.findOne({
				where: { uname },
			});
		} else {
			userExist = await User.findOne({
				where: {
					roles: { [Op.contains]: [role] },
					ref_id: ref_id.toString(),
				},
			});
		}
		if (userExist) {
			// If user already exists return error message and status code 400
			return res.status(400).json({
				status: "error",
				message: "User already exists",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		let count;
		if (role === "admin") {
			count = await User.count({
				where: { roles: { [Op.contains]: [role] } },
			});
		}

		// Create user
		const user = await User.create({
			uname,
			password: hashedPassword,
			roles: [role],
			ref_id: role === "admin" ? count + 1 : ref_id,
		});
		console.log(user.id, user.uname);

		const token = jwt.sign(
			{
				id: user.id,
				uname: user.uname,
				role: user.roles,
				ref_id: user.ref_id,
			},
			process.env.JWT_SECRET
		);
		res.cookie("x-pc-auth", token, { maxAge: 1000 * 60 * 60 * 24 });
		res.cookie("uname", uname, { maxAge: 1000 * 60 * 60 * 24 });

		return res.status(200).json({
			status: "success",
			message: "User created successfully",
			username: uname,
		});
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// admin login authentication controller
const admin_login = async (req, res) => {
	try {
		const User = models.direct_auth;
		// Missing params from body
		const { uname, password, role, ref_id } = req.body; // uname and password are required
		const missing = objectUtils.findMissing({
			uname,
			password,
			role,
			...((role === "MP" || role === "Ministry") && { ref_id }),
		});
		console.log(req.body);
		// If missing params, return error
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}

		// Find user by uname
		let user;

		if (role === "admin") {
			user = await User.findOne({
				where: {
					uname,
					roles: { [Op.contains]: [role] },
				},
			});
		} else {
			user = await User.findOne({
				where: {
					roles: { [Op.contains]: [role] },
					ref_id: ref_id,
				},
			});
		}
		if (!user) {
			// If user not found by uname return error message and status code 400
			return res
				.status(404)
				.json({ status: "error", message: "User not found" });
		}
		// Compare password with hashed password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			// If password does not match return error message and status code 400
			return res
				.status(400)
				.json({ status: "error", message: "Password incorrect" });
		}

		const token = jwt.sign(
			{
				id: user.id,
				uname: user.uname,
				role: user.roles,
				ref_id: user.ref_id,
			},
			process.env.JWT_SECRET
		);

		// If all is good, return token and status code 200
		res.cookie("x-pc-auth", token, { maxAge: 1000 * 60 * 60 * 24 });
		res.cookie("uname", user.uname, { maxAge: 1000 * 60 * 60 * 24 });
		res.status(200).json({
			status: "success",
			message: "User authorized successfully",
			username: user.uname,
		});
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// admin logout authentication controller
const admin_logout = (req, res) => {
	res.cookie("x-pc-auth", "", { httpOnly: true, maxAge: 0 });
	res.clearCookie("x-pc-auth");
	res.clearCookie("uname");
	res.status(200).json({
		status: "success",
		message: "User logged out successfully",
	});
};

const admin_authorize = async (req, res) => {
	const token = req.cookies["x-pc-auth"];
	console.log(req.cookies);
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.cookie("x-pc-auth", "", { httpOnly: true, maxAge: 0 });
			res.clearCookie("x-pc-auth");
			res.clearCookie("uname");
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}
		console.log(decoded);
		return res.status(200).json({
			success: true,
			message: "User authorized successfully",
			username: decoded.uname,
			role: decoded.role,
			ref_id: decoded.ref_id,
		});
	});
};

const change_password = async (req, res) => {
	try {
		const User = models.direct_auth;
		const { uname } = req.cookies;
		const { password, newPassword } = req.body;
		const missing = objectUtils.findMissing({ uname, password });
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}
		let user;
		if (req.user.role === "admin") {
			user = await User.findOne({
				where: { uname },
			});
		} else {
			user = await User.findOne({
				where: {
					roles: { [Op.contains]: [req.user.role] },
					ref_id: req.user.ref_id,
				},
			});
		}
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				status: "error",
				message: "Password incorrect",
			});
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await User.update({ password: hashedPassword }, { where: { uname } });
		return res.status(200).json({
			status: "success",
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error(error.stack);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: error,
		});
	}
};

// create a new house and its version

export default {
	admin_signup,
	admin_login,
	admin_logout,
	admin_authorize,
	change_password,
};
