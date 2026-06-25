import { getProducts } from './routes/products.js';
import { getCategories } from './routes/categories.js';
import express from 'express';

const app = express();
const port = 3000;

app.get('/products', (req, res) => {
  const { inStock, categoryId } = req.query;
  const products = getProducts();
  const filteredProducts = products.filter(product => {
    if (inStock !== undefined && product.inStock !== (inStock === 'true')) return false;
    if (categoryId !== undefined && product.categoryId !== Number(categoryId)) return false;
    return true;
  });
  res.json(filteredProducts);
});

app.get('/categories', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});