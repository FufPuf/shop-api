type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  categoryId: number;
};

const getProducts = (): Product[] => {
  return [
    { id: 1, name: 'Product A', price: 29.99, inStock: true, categoryId: 1 },
    { id: 2, name: 'Product B', price: 49.99, inStock: false, categoryId: 2 },
    { id: 3, name: 'Product C', price: 19.99, inStock: true, categoryId: 3 },
  ];
}

export type { Product };
export { getProducts };