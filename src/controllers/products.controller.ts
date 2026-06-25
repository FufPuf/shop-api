import { getProducts } from '../routes/products.js';
import express from 'express';

const productsController = express.Router();

productsController.get('/', (req, res) => {
  const { inStock, categoryId } = req.query;
  const products = getProducts();
  const filteredProducts = products.filter(product => {
    if (inStock !== undefined && product.inStock !== (inStock === 'true')) return false;
    if (categoryId !== undefined && product.categoryId !== Number(categoryId)) return false;
    return true;
  });
  res.json(filteredProducts);
});

export default productsController;