type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  categoryId: number;
};

let products: Product[] = [
    { id: 1, name: 'Product A', price: 29.99, inStock: true, categoryId: 1 },
    { id: 2, name: 'Product B', price: 49.99, inStock: false, categoryId: 2 },
    { id: 3, name: 'Product C', price: 19.99, inStock: true, categoryId: 3 },
  ];

const getProducts = (): Product[] => {
  return products;
}

const addProduct = (product: Product): void => {
  products.push(product);
}

export type { Product };
export { getProducts, addProduct };