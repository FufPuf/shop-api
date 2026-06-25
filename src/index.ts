import express from 'express';
import productsController from './controllers/products.controller.js';
import categoriesController from './controllers/categories.controller.js';

const app = express();
const port = 3000;

app.use('/products', productsController);
app.use('/categories', categoriesController);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});