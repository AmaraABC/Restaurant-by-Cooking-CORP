import { Router } from 'express';
import {
    getPlats,
    getPlatById,
    createPlat,
    updatePlat,
    deletePlat
} from '../controllers/plat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', getPlats);
router.get('/:id', getPlatById);

router.post("/", authenticate, authorize("staff"), createPlat);
router.put("/:id", authenticate, authorize("staff"), updatePlat);
router.delete("/:id", authenticate, authorize("staff"), deletePlat);

export default router;