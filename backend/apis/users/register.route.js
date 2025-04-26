import express from 'express';
import { registerUserController } from './register.controller.js';

const router = express.Router();

router.post('/', registerUserController);

export default router;
