import fs from "fs/promises";
import path from "path";

export interface JsonProduct {
  id: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  images: string[];
  specs: any;
  stock: number;
  image: string;
}

export interface JsonCategoryData {
  id: string;
  name: string;
  brands: string[];
  category: string;
  products: JsonProduct[];
}

export async function getCategories() {
  const dataDir = path.join(process.cwd(), "data");
  const files = await fs.readdir(dataDir);
  const categories = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(dataDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const parsed: JsonCategoryData = JSON.parse(content);
      categories.push({
        id: parsed.id,
        name: parsed.name,
        slug: parsed.id, // using id as slug
        image: parsed.products[0]?.images[0] || "placeholder.jpg",
      });
    }
  }
  return categories;
}

export async function getProducts(filter?: "featured" | "bestsellers") {
  const dataDir = path.join(process.cwd(), "data");
  const files = await fs.readdir(dataDir);
  let allProducts: any[] = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(dataDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const parsed: JsonCategoryData = JSON.parse(content);
      
      const products = parsed.products.map(p => ({
        id: p.id,
        name: `${p.brand} ${p.model}`,
        price: p.price,
        images: p.images,
        category: parsed.name,
        brand: p.brand,
        isFeatured: Math.random() > 0.8, // Randomly feature some products
        isBestSeller: Math.random() > 0.8,
      }));
      
      allProducts = [...allProducts, ...products];
    }
  }
  
  if (filter === "featured") {
    return allProducts.filter(p => p.isFeatured).slice(0, 8);
  }
  if (filter === "bestsellers") {
    return allProducts.filter(p => p.isBestSeller).slice(0, 8);
  }
  
  return allProducts;
}
