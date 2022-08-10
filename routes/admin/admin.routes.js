// admin route paths
export default {
	// sabha
	create_parliament: "/parliament/sabha/create",
	delete_parliament: "/parliament/sabha/delete",
	set_parliament_version: "/parliament/sabha/set_version",
	get_parliament_version: "/parliament/sabha/get_version",

	// mp
	register_mp: "/parliament/mp/register",
	getMpById: "/parliament/mp/id",
	getAllMps: "/parliament/mp/all",
	deleteMpById: "/parliament/mp/delete",

	// ministry
	register_ministry: "/parliament/ministry/register",
	getMinistryById: "/parliament/ministry/id",
	getAllMinistries: "/parliament/ministry/all",
	deleteMinistryById: "/parliament/ministry/delete",

	// question
	upload_question: "/parliament/question/upload",
	get_question_by_id: "/parliament/question/id",
	get_recent_question: "/parliament/question/recent",
	get_question_by_query: "/parliament/question/query",
	get_question_by_id_sabha_version: "/parliament/question/sabha/id",
	answer_question: "/parliament/question/answer",
};
