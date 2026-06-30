import db from "../db/database.js";
import type { Category } from "../routes/categories.js";

/**
 * Get all categories from the database
 * @returns An array of all categories
 */
const getAllCategories = (): Category[] => {
  const categories: Category[] = db.prepare('SELECT * FROM categories').all() as Category[];
  return categories;
};

/**
 * Get a category by its ID
 * @param id - The ID of the category
 * @returns The category with the specified ID
 */
const getCategoryById = (id: number): Category | undefined => {
  const category: Category | undefined = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
  return category;
};

export { getAllCategories, getCategoryById };