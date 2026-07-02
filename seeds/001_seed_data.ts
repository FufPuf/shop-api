import db from '../src/db/database.js';

import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Seed data for categories and products
  const categories = [
    { id: 1, name: 'Category A', slug: 'category-a' },
    { id: 2, name: 'Category B', slug: 'category-b' },
    { id: 3, name: 'Category C', slug: 'category-c' },
  ];

  const products = [
    { id: 1, name: 'Product A', price: 29.99, categoryId: 1, inStock: 1 },
    { id: 2, name: 'Product B', price: 49.99, categoryId: 2, inStock: 0 },
    { id: 3, name: 'Product C', price: 19.99, categoryId: 3, inStock: 1 },
  ];
  
  // delete existing data first
  await knex('products').del();
  await knex('categories').del();
  
  // insert seed data
  await knex('categories').insert(categories);
  await knex('products').insert(products);
}