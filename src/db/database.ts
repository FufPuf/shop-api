import Database from 'better-sqlite3';

const db = new Database('shop.db');

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

const isProductsTableEmpty = (
    db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number }
).count === 0;

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

export default db;