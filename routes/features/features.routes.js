export default {
	// Polls
	polls_create: "/polls/create",
	polls_delete: "/polls/delete",
	polls_update: "/polls/update",
	polls_get_all: "/polls/all",
	polls_get: "/polls/get/:id",
	polls_vote: "/polls/vote",

	// Posts
	posts_create: "/posts/create",
	posts_delete: "/posts/delete",
	posts_update: "/posts/update",
	// posts_get_all: "/posts/get/all",
	posts_get_all_by_user: "/posts/all",
	posts_get: "/posts/get/:id",
	like_post: "/posts/like",
	unlike_post: "/posts/unlike",
};
