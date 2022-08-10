import express from "express";
import adminRouter from "./admin/adminRouter.js";
import authRouter from "./auth/authRouter.js";
const router = express.Router();

// direct_admin auth routes
router.use("/auth", authRouter);

// direct_admin access routes
router.use("/admin", adminRouter);

export default router;
