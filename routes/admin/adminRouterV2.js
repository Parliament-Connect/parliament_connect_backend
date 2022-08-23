import adminRouterPath from "./admin.routes.js";
import verify from "../../middleware/auth.jwt.js";
import indexController from "../../controller/Indexer/index.controller.js";
import { Router } from "express";

const router = Router();

router.post(adminRouterPath.create_sabha, verify, indexController.create_index);
router.post(adminRouterPath.delete_sabha, verify, indexController.delete_index);
router.post(
	adminRouterPath.upload_question,
	verify,
	indexController.upload_question
);
router.post(
	adminRouterPath.upload_answer,
	verify,
	indexController.upload_answer
);
router.post(adminRouterPath.get_indices, verify, indexController.getIndices);
router.post(adminRouterPath.get_mps, verify, indexController.getMPs);
router.post(
	adminRouterPath.get_user_unanswered_questions,
	verify,
	indexController.getUserUnansweredQuestions
);

export default router;
