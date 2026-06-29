import { getAllProducts, getProductById, createProduct} from '../services/products.service.js';
import express from 'express';
import httpError from '../utils/httpError.js';
import { createProductSchema } from '../validators/product.validator.js';

const productsController = express.Router();

productsController.get('/', (req, res) => {
  const { inStock, categoryId } = req.query;
  const products = getAllProducts();
  const filteredProducts = products.filter(product => {
    if (inStock !== undefined && Boolean(product.inStock) !== (inStock === 'true')) return false;
    if (categoryId !== undefined && product.categoryId !== Number(categoryId)) return false;
    return true;
  });
  res.json(filteredProducts);
});

productsController.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const product = getProductById(Number(id));
  
  if (product) {
    res.json(product);
  } else {
    next(httpError(404, "Product not found"));
  }
});

productsController.post('/', (req, res, next) => {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    return next(httpError(400, result.error.issues.map(issue => issue.message).join(', ')));
  }

  const newProduct = createProduct(result.data);
  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    next(httpError(500, "Failed to create product"));
  }
});

export default productsController;