import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase } from './database/connection';
import routes from './routes';
import { Logger } from './utils/logger';
import './models'; // Initialize all models and associations

// Load environment variables
dotenv.config();

const app = express();
const logger = Logger.getInstance();
const PORT = process.env.PORT || 5000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploaded images
const uploadsPath = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'خدمة API الصيدلية تعمل بشكل طبيعي',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'مرحباً بك في API الصيدلية الإلكترونية',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection and models
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
      logger.info('Uploads directory created');
    }

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 Pharmacy API Server started on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🏥 الصيدلية الإلكترونية                    ║
║                     Pharmacy Management API                  ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}                        ║
║  🏥 Health: http://localhost:${PORT}/health                 ║
║  📚 Docs:   http://localhost:${PORT}/api-docs              ║
║  🌐 Frontend: ${process.env.FRONTEND_URL}                      ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await require('./database/connection').closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await require('./database/connection').closeDatabaseConnection();
  process.exit(0);
});

// Start the server
startServer();