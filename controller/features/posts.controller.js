import { models } from "../../models/admin.js";
import { Op } from "sequelize";
import objectUtils from "../../utils/object.utils.js";
import direct_auth from "../../models/parliament_auth/parliament_direct.model.js";

const createPost = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Post = models.posts; // posts model
			const { title, image, content, tags } = req.body; // title, description, image, expiryDate and expiryTime are required
			console.log(req.body);
			console.log(req.user.id);
			// Missing params from body
			const missing = objectUtils.findMissing({
				title,
				content,
			});

			// If missing params, return error
			if (!objectUtils.objectIsEmpty(missing)) {
				return res.status(400).json({
					status: "error",
					message: "Missing required fields",
					missing,
				});
			}

			// Create post
			await Post.create({
				title,
				content,
				likes: 0,
				...(image && { image }),
				...(tags && { tags }),
				parliamentAuthId: req.user.id,
			});
			return res.status(200).json({
				status: "success",
				message: "Post created successfully",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: "Internal server error",
				error: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "You are not authorized to perform this action",
		});
	}
};

const getPosts = async (req, res) => {
	try {
		const Post = models.posts; // posts model
		const { page, limit } = req.query; // page and limit are optional
		const offset = (page - 1) * limit; // offset is the number of posts to skip

		const posts = await Post.findAll({
			...(offset && { offset }),
			...(limit && { limit }),
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json({
			status: "success",
			message: "Posts retrieved successfully",
			posts,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: error.message,
		});
	}
};

const getPost = async (req, res) => {
	try {
		const Post = models.posts; // posts model
		const { id } = req.params; // id is required
		console.log(req.params);
		const post = await Post.findOne({
			where: {
				id,
			},
		});
		return res.status(200).json({
			status: "success",
			message: "Post retrieved successfully",
			post,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
			error: error.message,
		});
	}
};

const updatePost = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Post = models.posts; // posts model
			const { id, title, image, content, tags } = req.body; // title, description, image, expiryDate and expiryTime are required

			// Missing params from body
			const missing = objectUtils.findMissing({
				id,
			});

			// If missing params, return error
			if (!objectUtils.objectIsEmpty(missing)) {
				return res.status(400).json({
					status: "error",
					message: "Missing required fields",
					missing,
				});
			}

			console.log(title, content);
			if (title === undefined && content === undefined) {
				return res.status(400).json({
					status: "error",
					message: "Either title or content is required",
				});
			}

			// Update post
			await Post.update(
				{
					title,
					content,
					...(image && { image }),
					...(tags && { tags }),
				},
				{
					where: {
						id,
					},
				}
			);
			return res.status(200).json({
				status: "success",
				message: "Post updated successfully",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: "Internal server error",
				error: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "You are not authorized to perform this action",
		});
	}
};

const deletePost = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Post = models.posts; // posts model
			const { id } = req.body; // id is required
			const post = await Post.findOne({
				where: {
					id,
				},
			});
			if (!post) {
				return res.status(404).json({
					status: "error",
					message: "Post not found",
				});
			}
			await Post.destroy({
				where: {
					id,
				},
			});
			return res.status(200).json({
				status: "success",
				message: "Post deleted successfully",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: "Internal server error",
				error: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "You are not authorized to perform this action",
		});
	}
};

const likePost = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Post = models.posts; // posts model
			const { id } = req.body; // id is required
			const post = await Post.findOne({
				where: {
					id,
				},
			});
			if (!post) {
				return res.status(404).json({
					status: "error",
					message: "Post not found",
				});
			}
			await Post.update(
				{
					likes: post.likes + 1,
				},
				{
					where: {
						id,
					},
				}
			);
			return res.status(200).json({
				status: "success",
				message: "Post liked successfully",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: "Internal server error",
				error: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "You are not authorized to perform this action",
		});
	}
};

const unlikePost = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Post = models.posts; // posts model
			const { id } = req.body; // id is required
			const post = await Post.findOne({
				where: {
					id,
				},
			});
			if (!post) {
				return res.status(404).json({
					status: "error",
					message: "Post not found",
				});
			}

			if (post.likes === 0) {
				return res.status(400).json({
					status: "error",
					message: "Post has no likes",
				});
			}

			await Post.update(
				{
					likes: post.likes - 1,
				},
				{
					where: {
						id,
					},
				}
			);
			return res.status(200).json({
				status: "success",
				message: "Post unliked successfully",
			});
		} catch (error) {
			return res.status(500).json({
				status: "error",
				message: "Internal server error",
				error: error.message,
			});
		}
	} else {
		return res.status(403).json({
			status: "error",
			message: "You are not authorized to perform this action",
		});
	}
};

const getAllUserPosts = async (req, res) => {
	if (req.user.role.includes("MP") || req.user.role.includes("Ministry")) {
		try {
			const Posts = models.posts; // posts model
			const { page, limit } = req.body; // page and limit are optional
			const pageNumber = parseInt(page) || 1; // default page number is 1
			const limitNumber = parseInt(limit) || 10; // default limit is 10
			const offset = (pageNumber - 1) * limitNumber; // offset is the number of records to skip

			const pa_id = req.user.id;

			const posts = await Posts.findAll({
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
				message: "Posts retrieved",
				posts,
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
			message: "Only MPs and Ministries can get all posts",
		});
	}
};

export default {
	createPost,
	getPosts,
	getPost,
	updatePost,
	deletePost,
	likePost,
	unlikePost,
	getAllUserPosts,
};
