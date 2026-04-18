import { Router } from "express";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/",getAllRecords);
router.get("/:id",getRecordById);
router.post("/",createRecord);
router.put("/:id",updateRecord);
router.delete("/:id", deleteRecord);

export default router;