type Category = {
  id: number;
  name: string;
  slug: string;
};

const getCategories = (): Category[] => {
  return [
    { id: 1, name: 'Category A', slug: 'category-a' },
    { id: 2, name: 'Category B', slug: 'category-b' },
    { id: 3, name: 'Category C', slug: 'category-c' },
  ];
}

export type { Category };
export { getCategories };