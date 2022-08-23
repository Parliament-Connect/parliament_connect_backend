import express from "express";
import adminRouter from "./admin/adminRouter.js";
import adminRouterV2 from "./admin/adminRouterV2.js";
import authRouter from "./auth/authRouter.js";
import featuresRouter from "./features/featuresRouter.js";
const router = express.Router();

// direct_admin auth routes
router.use("/auth", authRouter);

// direct_admin access routes
router.use("/admin", adminRouter);

// direct_admin access routes v2
router.use("/admin/v2", adminRouterV2);

// features access routes
router.use("/admin/features", featuresRouter);

export default router;
