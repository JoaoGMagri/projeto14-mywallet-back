import { Router } from "express";

import { postTransfers, getTransfers } from "../controllers/records.controller.js"
import { authorization } from "../middleware/authorization.middleware.js";
import { postTransfersMD } from "../middleware/postTransfers.middleware.js"
import { getTransfersMD } from "../middleware/getTransfers.middleware.js";

const router = Router();
router.use(authorization);

router.post( "/transfers", postTransfersMD, postTransfers );
router.get( "/transfers", getTransfersMD, getTransfers );

export default router;