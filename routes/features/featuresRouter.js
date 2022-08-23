import { Router } from "express";
import featuresRoutes from "./features.routes.js";
import pollsController from "../../controller/features/polls.controller.js";
import postsController from "../../controller/features/posts.controller.js";
import verify from "../../middleware/auth.jwt.js";

const router = Router();

// POST /features/polls - create a new poll
router.post(featuresRoutes.polls_create, verify, pollsController.createPoll);
// POST /features/polls/delete - delete a poll
router.post(featuresRoutes.polls_delete, verify, pollsController.deletePoll);
// POST /features/polls/get/all - get all polls
router.post(
	featuresRoutes.polls_get_all,
	verify,
	pollsController.getAllUserPolls
);
// POST /features/polls/update - update a poll
router.post(featuresRoutes.polls_update, verify, pollsController.updatePoll);
// POST /features/polls/get - get a poll
router.get(featuresRoutes.polls_get, verify, pollsController.getPoll);
// POST /features/polls/vote - vote on a poll
router.post(featuresRoutes.polls_vote, verify, pollsController.vote);

// Posts

// POST /features/posts/create - create a new post
router.post(featuresRoutes.posts_create, verify, postsController.createPost);
// POST /features/posts/get/all - get all posts
// router.post(featuresRoutes.posts_get_all, verify, postsController.getPosts);
router.post(
	featuresRoutes.posts_get_all_by_user,
	verify,
	postsController.getAllUserPosts
);
// POST /features/posts/get - get a post
router.get(featuresRoutes.posts_get, verify, postsController.getPost);
// POST /features/posts/update - update a post
router.post(featuresRoutes.posts_update, verify, postsController.updatePost);
// POST /features/posts/delete - delete a post
router.post(featuresRoutes.posts_delete, verify, postsController.deletePost);
// POST /features/posts/like - like a post
router.post(featuresRoutes.like_post, verify, postsController.likePost);
// POST /features/posts/unlike - unlike a post
router.post(featuresRoutes.unlike_post, verify, postsController.unlikePost);

export default router;
