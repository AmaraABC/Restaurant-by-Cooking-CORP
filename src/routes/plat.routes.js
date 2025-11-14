import { Router } from 'express';
import {
    getPlats,
    getPlatById,
    createPlat,
    updatePlat,
    deletePlat
} from '../controllers/plat.controller.js';

const router = Router();

router.get('/', getPlats);
router.get('/:id', getPlatById);
router.post('/', createPlat);
router.put('/:id', updatePlat);
router.delete('/:id', deletePlat);

export default router;
