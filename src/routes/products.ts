type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  category: { id: number, name: string, slug: string };
};

export type { Product };