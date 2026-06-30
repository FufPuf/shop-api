import express from 'express';

import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../services/products.service.js';
import httpError from '../utils/httpError.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

/**
 * Products controller
 */
const productsController = express.Router();

/**
 * Get all products
 */
productsController.get('/', authMiddleware, (req, res) => {
  const { inStock, categoryId } = req.query;
  const products = getAllProducts();
  const filteredProducts = products.filter(product => {
    if (inStock !== undefined && Boolean(product.inStock) !== (inStock === 'true')) return false;
    if (categoryId !== undefined && product.category.id !== Number(categoryId)) return false;
    return true;
  });
  res.json(filteredProducts);
});

/**
 * Get a product by ID
 */
productsController.get('/:id', authMiddleware, (req, res, next) => {
  const { id } = req.params;
  const product = getProductById(Number(id));
  
  if (product) {
    res.json(product);
  } else {
    next(httpError(404, "Product not found"));
  }
});

/**
 * Create a new product
 */
productsController.post('/', authMiddleware, (req, res, next) => {
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

/**
 * Update a product by ID
 */
productsController.patch('/:id', authMiddleware, (req, res, next) => {
  const { id } = req.params;
  const validationResult = updateProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(httpError(400, validationResult.error.issues.map(issue => issue.message).join(', ')));
  }

  const validatedData = Object.fromEntries(Object.entries(validationResult.data).filter(([_, v]) => v !== undefined));

  const updatedProduct = updateProduct(Number(id), validatedData);
  if (!updatedProduct) {
    return next(httpError(404, "Product not found"));
  }

  res.json(updatedProduct);
});

/**
 * Delete a product by ID
 */
productsController.delete('/:id', authMiddleware, (req, res, next) => {
  const { id } = req.params;
  const isDeleted = deleteProduct(Number(id));

  if (!isDeleted) {
    return next(httpError(404, "Product not found"));
  }

  res.status(204).send();
});

export default productsController;