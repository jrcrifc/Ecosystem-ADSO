import express from 'express';
import { getConfigs, updateConfig } from '../controller/configController.js';
import { soloAdmin } from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, soloAdmin, getConfigs);
router.put('/', authMiddleware, soloAdmin, updateConfig);

export default router;
