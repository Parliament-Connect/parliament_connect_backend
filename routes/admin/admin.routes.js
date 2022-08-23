// admin route paths
export default {
	// sabha
	create_parliament: "/parliament/sabha/create",
	delete_parliament: "/parliament/sabha/delete",
	set_parliament_version: "/parliament/sabha/set_version",
	get_parliament_version: "/parliament/sabha/get_version",

	// Indexer
	// sabha v2
	create_sabha: "/parliament/index/create",
	delete_sabha: "/parliament/index/delete",
	upload_question: "/parliament/question/upload",
	upload_answer: "/parliament/answer",
	get_indices: "/parliament/get/indices",
	get_mps: "/parliament/mp",
	get_user_unanswered_questions: "/parliament/unanswered",

	//Admin
	getAllUsers: "/parliament/users",

	// mp
	register_mp: "/parliament/mp/register",
	getMpById: "/parliament/mp/id/:mp_id", // POST request
	deleteMpById: "/parliament/mp/id", // DELETE request
	getAllMps: "/parliament/mp/all",
	getAllMpNames: "/parliament/mp/all/name",

	// ministry
	register_ministry: "/parliament/ministry/register",
	getMinistryById: "/parliament/ministry/id",
	deleteMinistryById: "/parliament/ministry/id",
	getAllMinistries: "/parliament/ministry/all",
	getAllMinistryNames: "/parliament/ministry/all/name",
};
