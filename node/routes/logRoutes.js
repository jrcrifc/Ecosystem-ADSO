import express from 'express';
import { getLogs } from '../controller/logController.js';
import { soloAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', soloAdmin, getLogs);

export default router;
