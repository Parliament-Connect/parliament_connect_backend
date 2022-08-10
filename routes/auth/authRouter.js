import { Router } from "express";
import authRouterPath from "./auth.routes.js";
import auth from "../../controller/auth/auth.controller.js";

const router = Router();
// direct_admin auth routes

// POST /auth/signup - create a new admin user
router.post(authRouterPath.admin_signup, auth.admin_signup);
// POST /auth/login - login an admin user
router.post(authRouterPath.admin_login, auth.admin_login);
// POST /auth/logout - logout an admin user
router.post(authRouterPath.admin_logout, auth.admin_logout);
// POST /auth/authorize - authorize an admin user
router.get(authRouterPath.admin_authorize, auth.admin_authorize);

export default router;
