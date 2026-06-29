import db from "../db/database.js";
import type { Product } from "../routes/products.js";

/**
 * Map a database row to a Product object
 * @param row - The database row
 * @returns The mapped Product object
 */
const mapProduct = (row: any): Product => ({
  ...row,
  inStock: row.inStock === 1,
});

/**
 * Get all products from the database
 * @returns An array of all products
 */
const getAllProducts = (): Product[] => {
  const products: Product[] = db.prepare('SELECT * FROM products').all() as Product[];
  return products.map(mapProduct);
};

/**
 * Get a product by its ID
 * @param id - The ID of the product
 * @returns The product with the specified ID
 */
const getProductById = (id: number): Product | undefined => {
  const product: Product | undefined = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
  return product ? mapProduct(product) : undefined;
};

/**
 * Create a new product
 * @param data - The product data
 * @returns The newly created product
 */
const createProduct = (data: { name: string, price: number, categoryId: number, inStock: boolean }): Product | undefined => {
    const { name, price, categoryId, inStock } = data;
    const insert = db.prepare('INSERT INTO products (name, price, categoryId, inStock) VALUES (?, ?, ?, ?)');
    const result = insert.run(name, price, categoryId, inStock ? 1 : 0);
    return getProductById(result.lastInsertRowid as number) as Product | undefined;
};

export { getAllProducts, getProductById, createProduct };