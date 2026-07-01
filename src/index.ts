import 'dotenv/config';
import express from 'express';
import productsController from './controllers/products.controller.js';
import categoriesController from './controllers/categories.controller.js';
import authController from './controllers/auth.controller.js';
import logger from './utils/logger.js';

import type { HttpError } from './utils/httpError.js';
import loggingMiddleware from './middleware/logging.middleware.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(loggingMiddleware);
app.use('/products', productsController);
app.use('/categories', categoriesController);
app.use('/auth', authController);
app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  const statusCode = err.status ?? 500;
  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});