import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {models} from "../../models/auth.js";
import objectUtils from "../../utils/object.utils.js";
import CookieSession from "cookie-session";

// admin signup authentication controller
const admin_signup = async (req, res) => {
	try {
		const User = models.direct_auth; // direct_auth model

		const { uname, password } = req.body; // id, uname and password are required

		// Missing params from body
		const missing = objectUtils.findMissing({ uname, password });
		// If missing params, return error
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}

		// Check if user already exists
		const userExist = await User.findOne({ where: { uname } });
		if (userExist) {
			// If user already exists return error message and status code 400
			return res.status(400).json({
				status: "error",
				message: "Username already exists",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await User.create({ uname, password: hashedPassword });

		const token = jwt.sign(
			{ id: user.id, uname: user.uname },
			process.env.JWT_SECRET
		);
		res.cookie('x-pc-auth', token, { maxAge: 1000 * 60 * 60 * 24 });
		res.cookie('uname', user.uname, { maxAge: 1000 * 60 * 60 * 24 });

		return res.status(201).json({
			// If all is good, return token and status code 201
			status: "success",
			message: "User created successfully"
		});
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error.stack);
		res.status(500).json({
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
		const { uname, password } = req.body; // uname and password are required
		const missing = objectUtils.findMissing({ uname, password });
		// If missing params, return error
		if (!objectUtils.objectIsEmpty(missing)) {
			return res.status(400).json({
				status: "error",
				message: "Missing required fields",
				missing,
			});
		}

		// Find user by uname
		const user = await User.findOne({ where: { uname } });
		if (!user) {
			// If user not found by uname return error message and status code 400
			return res
				.status(404)
				.json({ status: "error", message: "Username not found" });
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
			{ id: user.id, uname: user.uname },
			process.env.JWT_SECRET
		);
		// If all is good, return token and status code 200
		res.cookie('x-pc-auth', token, { maxAge: 1000 * 60 * 60 * 24 });
		res.cookie('uname', user.uname, { maxAge: 1000 * 60 * 60 * 24 });
		res.status(200).json({
			status: "success",
			message: "User authorized successfully",
			username: user.uname
		});
	} catch (error) {
		// If error, log error and return error message and status code 500
		console.error(error.stack);
		res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// admin logout authentication controller
const admin_logout = (req, res) => {
	res.cookie('x-pc-auth', '', { httpOnly: true, maxAge: 0 });
	res.clearCookie('x-pc-auth');
	res.clearCookie('uname');
	res.status(200).json({
		status: "success",
		message: "User logged out successfully",
	});
}

const admin_authorize = async (req, res) => {
	const token = req.cookies['x-pc-auth'];
	console.log(req.cookies);
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.cookie('x-pc-auth', '', { httpOnly: true, maxAge: 0 });
			res.clearCookie('x-pc-auth');
			res.clearCookie('uname');
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}
		return res.status(200).json({
			success: true,
			message: "User authorized successfully",
			username: decoded.uname
		});
	} );
}

// create a new house and its version

export default {
	admin_signup,
	admin_login,
	admin_logout,
	admin_authorize
};
