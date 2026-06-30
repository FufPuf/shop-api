import Database from 'better-sqlite3';

const db = new Database('shop.db');

//--------------------------------------- init products table ---------------------------------------//

// Products table schema
// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    categoryId INTEGER NOT NULL,
    inStock INTEGER NOT NULL
  )
`);

// Check if the products table is empty
const isProductsTableEmpty = (
    db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number }
).count === 0;

// Insert initial data if tables are empty
if (isProductsTableEmpty) {
    const insert = db.prepare('INSERT INTO products (name, price, categoryId, inStock) VALUES (?, ?, ?, ?)');
    const products = [
        { name: 'Product A', price: 29.99, categoryId: 1, inStock: 1 },
        { name: 'Product B', price: 49.99, categoryId: 2, inStock: 0 },
        { name: 'Product C', price: 19.99, categoryId: 3, inStock: 1 },
    ];

    const insertMany = db.transaction((products: { name: string; price: number; categoryId: number; inStock: number }[]): void => {
        for (const product of products) {
            insert.run(product.name, product.price, product.categoryId, product.inStock);
        }
    });

    insertMany(products);
}

//--------------------------------------- init categories table ---------------------------------------//

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
  )
`);

// Check if the categories table is empty
const isCategoriesTableEmpty = (
    db.prepare('SELECT COUNT(*) AS count FROM categories').get() as { count: number }
).count === 0;

// Insert initial categories if the categories table is empty
if (isCategoriesTableEmpty) {
    const insert = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
    const categories = [
    { name: 'Category A', slug: 'category-a' },
    { name: 'Category B', slug: 'category-b' },
    { name: 'Category C', slug: 'category-c' },
  ];

    const insertMany = db.transaction((categories: { name: string; slug: string }[]): void => {
        for (const category of categories) {
            insert.run(category.name, category.slug);
        }
    });

    insertMany(categories);
}

//--------------------------------------- init users table ---------------------------------------//

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

export default db;