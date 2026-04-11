import { Router } from "express";

const router = Router();

router.get("/",getAllRecords);
router.get("/:id",getRecordById);
router.post("/",createRecord);
router.put("/:id",updateRecord);
router.delete("/:id", deleteRecord);
