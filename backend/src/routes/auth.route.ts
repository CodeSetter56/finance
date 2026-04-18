import { Router } from "express";
import type { IRouter } from "express";
import { login, logout, refreshToken, register } from "../services/auth.service.js";

const router: IRouter = Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh", refreshToken)

export default router;