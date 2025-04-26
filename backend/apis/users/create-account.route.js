import express from 'express';
import { createAccountController } from './create-account.controller.js';

const router = express.Router();

// Route: POST /users/create-account
router.post('/', createAccountController);

export default router;
