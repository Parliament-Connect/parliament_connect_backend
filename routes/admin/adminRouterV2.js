import adminRouterPath from "./admin.routes.js";
import verify from "../../middleware/auth.jwt.js";
import indexController from "../../controller/Indexer/index.controller.js";
import { Router } from "express";

const router = Router();

// POST /admin/parliament/sabha/create - create a new parliament (sabha) index
router.post(adminRouterPath.create_sabha, verify, indexController.create_index);
// POST /admin/parliament/sabha/delete - delete a parliament (sabha) index
router.post(adminRouterPath.delete_sabha, verify, indexController.delete_index);
// POST /admin/parliament/question/upload - upload a question to parliament (sabha) index
router.post(
	adminRouterPath.upload_question,
	verify,
	indexController.upload_question
);
// POST /admin/parliament/answer - upload an answer to parliament (sabha) index
router.post(
	adminRouterPath.upload_answer,
	verify,
	indexController.upload_answer
);
// POST /admin/parliament/get/indices - get all parliament (sabha) indices
router.post(adminRouterPath.get_indices, verify, indexController.getIndices);
// POST /admin/parliament/mps - get all mp records
router.post(adminRouterPath.get_mps, verify, indexController.getMPs);
// POST /admin/parliament/unanswered - get all unanswered questions
router.post(
	adminRouterPath.get_user_unanswered_questions,
	verify,
	indexController.getUserUnansweredQuestions
);

export default router;
