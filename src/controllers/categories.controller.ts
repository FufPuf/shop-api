import { getCategories } from '../routes/categories.js';
import express from 'express';

const categoriesController = express.Router();

categoriesController.get('/', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

categoriesController.get('/:id', (req, res) => {
  const { id } = req.params;
  const categories = getCategories();
  const category = categories.find(category => category.id === Number(id));
  
  if (category) res.json(category);
  else res.status(404).json({ error: "Category not found" });
});

export default categoriesController;