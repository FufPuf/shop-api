import { getProducts } from '../routes/products.js';
import express from 'express';
import httpError from '../utils/httpError.js';

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

productsController.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const products = getProducts();
  const product = products.find(product => product.id === Number(id));
  
  if (product) {
    res.json(product);
  } else {
    next(httpError(404, "Product not found"));
  }
});

export default productsController;