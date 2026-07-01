import db from "../db/database.js";
import type { Product } from "../routes/products.js";

/**
 * Map a database row to a Product object
 * @param row - The database row
 * @returns The mapped Product object
 */
const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: row.price,
  inStock: row.inStock === 1,
  category: {
    id: row.categoryId,
    name: row.categoryName,
    slug: row.categorySlug,
  }
});

/**
 * Get the total count of products in the database
 * @returns The total number of products
 */
const getProductCount = (filters?: { inStock?: number | undefined, categoryId?: number | undefined }): number => {
  let query = 'SELECT COUNT(*) as count FROM products';
  const queryParams: any[] = [];

  if (filters) {
    const filterConditions: string[] = [];
    if (filters.inStock !== undefined) {
      filterConditions.push('inStock = ?');
      queryParams.push(filters.inStock);
    }
    if (filters.categoryId !== undefined) {
      filterConditions.push('categoryId = ?');
      queryParams.push(filters.categoryId);
    }
    if (filterConditions.length > 0) {
      query += ' WHERE ' + filterConditions.join(' AND ');
    }
  }

  const countRow = db.prepare(query).get(...queryParams) as { count: number };
  return countRow.count;
};

/**
 * Get all products from the database
 * @returns An array of all products
 */
const getAllProducts = (page: number, pageSize: number, filters?: { inStock?: number | undefined, categoryId?: number | undefined }): Product[] => {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT products.*, categories.name as categoryName, categories.slug as categorySlug FROM products JOIN categories ON products.categoryId = categories.id';
  const queryParams: any[] = [];

  if (filters) {
    const filterConditions: string[] = [];
    if (filters.inStock !== undefined) {
      filterConditions.push('products.inStock = ?');
      queryParams.push(filters.inStock);
    }
    if (filters.categoryId !== undefined) {
      filterConditions.push('products.categoryId = ?');
      queryParams.push(filters.categoryId);
    }
    if (filterConditions.length > 0) {
      query += ' WHERE ' + filterConditions.join(' AND ');
    }
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(pageSize, offset);

  const products: Product[] = db.prepare(query).all(...queryParams) as Product[];
  return products.map(mapProduct);
};

/**
 * Get a product by its ID
 * @param id - The ID of the product
 * @returns The product with the specified ID
 */
const getProductById = (id: number): Product | undefined => {
  const product: Product | undefined = db.prepare('SELECT products.*, categories.name as categoryName, categories.slug as categorySlug FROM products JOIN categories ON products.categoryId = categories.id WHERE products.id = ?').get(id) as Product | undefined;
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

/**
 * Update an existing product
 * @param id - The ID of the product to update
 * @param data - The updated product data
 * @returns The updated product, or undefined if the product does not exist
 */
const updateProduct = (id: number, data: { name?: string, price?: number, categoryId?: number, inStock?: boolean }): Product | undefined => {
    const product = getProductById(id);
    if (!product) {
        return undefined;
    }

    const updatedProduct = {
        ...product,
        ...data,
        category: data.categoryId ? { id: data.categoryId, name: '', slug: '' } : product.category,
        inStock: data.inStock !== undefined ? data.inStock : product.inStock,
    };

    const update = db.prepare('UPDATE products SET name = ?, price = ?, categoryId = ?, inStock = ? WHERE id = ?');
    update.run(updatedProduct.name, updatedProduct.price, updatedProduct.category.id, updatedProduct.inStock ? 1 : 0, id);

    return getProductById(id) as Product ;
};

/**
 * Delete a product by its ID
 * @param id - The ID of the product to delete
 * @returns A boolean indicating whether the product was successfully deleted
 */
const deleteProduct = (id: number): boolean => {
    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = deleteStmt.run(id);
    return result.changes > 0;
};

export { getProductCount, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };