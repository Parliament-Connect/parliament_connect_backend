import { Router } from "express";
import adminRouterPath from "./admin.routes.js";
import admin from "../../controller/parliament/parliament.controller.js";
import mpController from "../../controller/parliament/mp.controller.js";
import ministryController from "../../controller/parliament/ministry.controller.js";
import questionController from "../../controller/parliament/parliamentQuestion.controller.js";
import verify from "../../middleware/auth.jwt.js";

const router = Router();

router.post("/test", (req, res) => {
	console.log(req.cookies);
	return res.status(200).json({message: "test"});
})

// ADMIN CONTROLLER

// POST /admin/parliament/sabha/create - create a new parliament (partition)
router.post(adminRouterPath.create_parliament, verify, admin.createParliament);
// PUT /admin/parliament/sabha/set_version - update the current parliament (sabha) version
router.put(
	adminRouterPath.set_parliament_version,
	verify,
	admin.setCurrentParliamentVersion
);
// DELETE /admin/parliament/sabha/delete - delete a parliament (sabha)
router.delete(
	adminRouterPath.delete_parliament,
	verify,
	admin.deleteParliament
);
// POST /admin/parliament/sabha/set_version - update the current parliament (sabha) version
router.post(
	adminRouterPath.set_parliament_version,
	verify,
	admin.setCurrentParliamentVersion
);
// GET /admin/parliament/sabha/get_version - fetch the current parliament (sabha) version
router.get(adminRouterPath.get_parliament_version, verify, admin.getCurrentParliamentVersion);

// MP CONTROLLER

// GET /admin/parliament/mp/id - get mp details by id
router.get(adminRouterPath.getMpById, verify, mpController.getMpById);
// GET /admin/parliament/mp/all - get all mps
router.get(adminRouterPath.getAllMps, verify, mpController.getAllMps);

// POST /admin/parliament/mp/register - register a new MP
router.post(adminRouterPath.register_mp, verify, mpController.registerMp);
// DELETE /admin/parliament/mp/delete - delete a MP
router.delete(adminRouterPath.deleteMpById, verify, mpController.deleteMp);

// MINISTRY CONTROLLER

// POST /admin/parliament/ministry/register - register a new ministry
router.post(
	adminRouterPath.register_ministry,
	verify,
	ministryController.registerMinistry
);
// GET /admin/parliament/ministry/id - get ministry details by id
router.get(
	adminRouterPath.getMinistryById,
	verify,
	ministryController.getMinistryById
);
// GET /admin/parliament/ministry/all - get all ministries
router.get(
	adminRouterPath.getAllMinistries,
	verify,
	ministryController.getAllMinistries
);
// DELETE /admin/parliament/ministry/delete - delete a ministry
router.delete(
	adminRouterPath.deleteMinistryById,
	verify,
	ministryController.deleteMinistry
);

// GET /admin/parliament/admin/test
router.get("/test", verify, (req, res) => {
	res.json({
		status: "success",
		message: "Admin route",
		user: req.user,
	});
});

// PARLIAMENT CONTROLLER
// POST /admin/parliament/question/upload - upload a question
router.post(
	adminRouterPath.upload_question,
	verify,
	questionController.uploadQuestion
);

// GET /admin/parliament/question/id - get question details by id
router.get(
	adminRouterPath.get_question_by_id,
	verify,
	questionController.getQuestionById
);

// GET /admin/parliament/question/recent - get recent questions
router.get(
	adminRouterPath.get_recent_question,
	questionController.getRecentQuestions
);

router.get(
	adminRouterPath.get_question_by_query,
	questionController.getQuestionsByQuery
);

// GET /admin/parliament/question/sabha/id - get question details by id and sabha version
router.get(
	adminRouterPath.get_question_by_id_sabha_version,
	verify,
	questionController.getQuestionByIdAndSabhaVersion
);

// PUT /admin/parliament/question/answer - answer a question
router.put(
	adminRouterPath.answer_question,
	verify,
	questionController.answerQuestion
);

export default router;
