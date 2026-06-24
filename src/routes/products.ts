type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};

const getProducts = (): Product[] => {
  return [
    { id: 1, name: 'Product A', price: 29.99, inStock: true },
    { id: 2, name: 'Product B', price: 49.99, inStock: false },
    { id: 3, name: 'Product C', price: 19.99, inStock: true },
  ];
}

export type { Product };
export { getProducts };