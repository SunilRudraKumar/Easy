import express from 'express';
import { sendSolController } from './send.controller.js';

const router = express.Router();
router.post('/', sendSolController);

export default router;
