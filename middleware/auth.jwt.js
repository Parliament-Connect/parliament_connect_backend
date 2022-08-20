import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
	const bearerToken = req.cookies["x-pc-auth"];
	console.log(req.get("host"));
	console.log(req.cookies);

	if (bearerToken !== undefined) {
		// const bearerToken = bearerHeader.split(" ")[1];
		if (bearerToken == null) {
			return res.status(401).json({
				status: "error",
				message: "Unauthorized1",
			});
		}
		jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					status: "error",
					message: "Unauthorized",
					token: bearerToken,
				});
			}
			req.user = decoded;
		});
		next();
	} else {
		return res.status(403).json({
			status: "error",
			message: "Forbidden",
		});
	}
}

export default verifyToken;
