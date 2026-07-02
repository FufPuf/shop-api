import express from 'express';

import { getAllCategories, getCategoryById } from '../services/categories.service.js';
import httpError from '../utils/httpError.js';
import authMiddleware from '../middleware/auth.middleware.js';

const categoriesController = express.Router();

categoriesController.get('/', (req, res) => {
  const categories = getAllCategories();
  res.json(categories);
});

categoriesController.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const category = getCategoryById(Number(id));
  
  if (category) {
    res.json(category);
  } else {
    next(httpError(404, "Category not found"));
  }
});

export default categoriesController;