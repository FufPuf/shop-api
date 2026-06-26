import { getCategories } from '../routes/categories.js';
import express from 'express';
import httpError from '../utils/httpError.js';

const categoriesController = express.Router();

categoriesController.get('/', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

categoriesController.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const categories = getCategories();
  const category = categories.find(category => category.id === Number(id));
  
  if (category) {
    res.json(category);
  } else {
    next(httpError(404, "Category not found"));
  }
});

export default categoriesController;