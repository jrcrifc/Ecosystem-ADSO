import express from 'express';
import { getLogs } from '../controller/logController.js';
import { authMiddleware, soloAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, soloAdmin, getLogs);

export default router;
