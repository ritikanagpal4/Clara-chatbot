import express from 'express';
import { handleChat } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Main chat endpoint
router.post('/chat', handleChat);

export default router;
