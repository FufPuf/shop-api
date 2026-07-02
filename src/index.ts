import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import ratelimit from 'express-rate-limit';
import express from 'express';
import productsController from './controllers/products.controller.js';
import categoriesController from './controllers/categories.controller.js';
import authController from './controllers/auth.controller.js';
import logger from './utils/logger.js';

import type { HttpError } from './utils/httpError.js';
import loggingMiddleware from './middleware/logging.middleware.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const authLimiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN  || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(loggingMiddleware);
app.use('/products', productsController);
app.use('/categories', categoriesController);
app.use('/auth', authLimiter, authController);
app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  const statusCode = err.status ?? 500;
  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

const isMain = process.argv[1]?.endsWith('index.js') || process.argv[1]?.endsWith('index.ts');

if (isMain) {
  app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });
}

export default app;