import express from 'express';
import productsController from './controllers/products.controller.js';
import categoriesController from './controllers/categories.controller.js';

import type { HttpError } from './utils/httpError.js';

const app = express();
const port = 3000;

app.use('/products', productsController);
app.use('/categories', categoriesController);

app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const statusCode = err.status ?? 500;
  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});