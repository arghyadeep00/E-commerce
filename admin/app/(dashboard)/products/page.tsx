import { getAllProducts, getAllCategories, getAllBrands } from "@/data/product";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <ProductsClient
      initialProducts={Array.isArray(products) ? products : []}
      categories={Array.isArray(categories) ? categories : []}
      brands={Array.isArray(brands) ? brands : []}
    />
  );
}
