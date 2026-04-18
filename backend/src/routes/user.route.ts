import { Router } from "express";
import type { IRouter } from "express";
import { deleteUser, getMyProfile, getProfile, getUsers } from "../services/user.service.js";
import { verifyRole, verifyToken } from "../middleware/auth.mid.js";

const router: IRouter = Router();

router.get("/", verifyToken ,verifyRole("admin"),getUsers);
router.get("/me", verifyToken ,getMyProfile);
router.get("/:id",verifyToken ,verifyRole("admin"),getProfile);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);

export default router;