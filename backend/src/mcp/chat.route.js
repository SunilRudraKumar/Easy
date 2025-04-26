import express from 'express';
import { generalChatController } from './chat.controller.js';

const router = express.Router();
router.post('/', generalChatController);

export default router;
