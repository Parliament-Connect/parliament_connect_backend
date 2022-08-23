import { Router } from "express";
import adminRouterPath from "./admin.routes.js";
import admin from "../../controller/parliament/parliament.controller.js";
import mpController from "../../controller/parliament/mp.controller.js";
import ministryController from "../../controller/parliament/ministry.controller.js";
import indexController from "../../controller/Indexer/index.controller.js";
import verify from "../../middleware/auth.jwt.js";

const router = Router();

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

// GET /admin/parliament/sabha/get_version - fetch the current parliament (sabha) version
router.get(
	adminRouterPath.get_parliament_version,
	verify,
	admin.getCurrentParliamentVersion
);

// MP CONTROLLER
// GET /admin/parliament/mp/id - get mp details by id
router.get(adminRouterPath.getMpById, verify, mpController.getMpById);
// GET /admin/parliament/mp/all - get all mps
router.get(adminRouterPath.getAllMps, verify, mpController.getAllMps);
// POST /admin/parliament/mp/register - register a new MP
router.post(adminRouterPath.register_mp, verify, mpController.registerMp);
// POST /admin/parliament/mp/all/name - get all mp names
router.get(adminRouterPath.getAllMpNames, mpController.getAllMpNames);
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
// GET /admin/parliament/ministry/all/name - get all ministry names
router.get(
	adminRouterPath.getAllMinistryNames,
	ministryController.getAllMinistryNames
);
// DELETE /admin/parliament/ministry/delete - delete a ministry
router.delete(
	adminRouterPath.deleteMinistryById,
	verify,
	ministryController.deleteMinistry
);

export default router;
