import { Router } from "express";

import { postTransfers, getTransfers } from "../controllers/records.controller.js"

const router = Router();

router.post( "/transfers", postTransfers );
router.get( "/transfers", getTransfers );

export default router;