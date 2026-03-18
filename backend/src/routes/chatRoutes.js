import express from 'express';
import { handleChat, getCacheStatus } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Main chat endpoint
router.post('/chat', handleChat);

// GET /api/cache-stats - Get cache statistics
router.get('/cache-stats', getCacheStatus);

export default router;
