import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: '🚀 Clara LLM Server is running',
        environment: config.nodeEnv,
        version: '1.0.0'
    });
});

app.use('/api', chatRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('💥 Server error:', err);
    res.status(500).json({ 
        success: false,
        error: err.message 
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Clara LLM Server`);
    console.log(`${'='.repeat(50)}`);
    console.log(`� Running on: http://localhost:${config.port}`);
    console.log(`📝 Chat endpoint: POST http://localhost:${config.port}/api/chat`);
    console.log(`💚 Health check: GET http://localhost:${config.port}/health`);
    console.log(`🔧 Environment: ${config.nodeEnv}`);
    console.log(`${'='.repeat(50)}\n`);
});
