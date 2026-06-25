import { getCategories } from '../routes/categories.js';
import express from 'express';

const categoriesController = express.Router();

categoriesController.get('/', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

export default categoriesController;