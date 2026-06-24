import { getProducts } from './routes/products.js';
import express from 'express';

const app = express();
const port = 3000;

app.get('/products', (req, res) => {
  const products = getProducts();
  res.json(products);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});