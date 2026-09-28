import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import docsRoutes from './routes/docsRoutes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // allow loading inline styles for api-docs
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      // Allow localhost or production client URL
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Documentation Page
app.use('/api-docs', docsRoutes);

// API v1 Routes
app.use('/api', routes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
