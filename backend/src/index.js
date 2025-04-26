import express from 'express';
import dotenv from 'dotenv';
import userRegisterRoute from '../apis/users/register.route.js';
import createAccountRoute from '../apis/users/create-account.route.js';
import sendSolRoute from '../apis/transactions/send.route.js';
import mcpChatRoute from './mcp/chat.route.js';
import { PrismaClient } from '../generated/prisma/index.js';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Auth & wallet routes
app.use('/users/register', userRegisterRoute);
app.use('/users/create-account', createAccountRoute);

// SOL transfer route
app.use('/transactions/send', sendSolRoute);

// MCP chat endpoint
app.use('/mcp/chat', mcpChatRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
