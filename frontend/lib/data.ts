import audioData from "../data/audio.js";
import componentsData from "../data/components.js";
import computerAccessoriesData from "../data/computer_accessories.js";
import gamingPeripheralsData from "../data/gaming_peripherals.js";
import laptopsData from "../data/laptops.js";
import powerAccessoriesData from "../data/power_accessories.js";
import smartphonesData from "../data/smartphones.js";
import tvsDisplaysData from "../data/tvs_displays.js";
import wearablesData from "../data/wearables.js";

export interface JsonProduct {
  id: string;
  brand: string;
  model: string;
  price: number;
  compareAtPrice?: number;
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
  images?: string[];
  image?: string;
}

const allData: JsonCategoryData[] = [
  audioData,
  componentsData,
  computerAccessoriesData,
  gamingPeripheralsData,
  laptopsData,
  powerAccessoriesData,
  smartphonesData,
  tvsDisplaysData,
  wearablesData,
] as JsonCategoryData[];

export async function getCategories() {
  return allData.map((parsed) => ({
    id: parsed.id,
    name: parsed.name,
    slug: parsed.id, // using id as slug
    image: parsed.images?.[0] || parsed.products[0]?.images[0] || "placeholder.jpg",
  }));
}

export async function getProductById(id: string) {
  for (const parsed of allData) {
    const product = parsed.products.find((p) => p.id === id);
    if (product) {
      return {
        ...product,
        name: `${product.brand} ${product.model}`,
        category: parsed.name,
      };
    }
  }
  return null;
}

export async function getProducts(filter?: "featured" | "bestsellers") {
  let allProducts: any[] = [];

  for (const parsed of allData) {
    const products = parsed.products.map(p => ({
      id: p.id,
      name: `${p.brand} ${p.model}`,
      price: p.price,
      images: p.images,
      category: parsed.name,
      brand: p.brand,
      specs: p.specs,
      stock: p.stock,
      isFeatured: Math.random() > 0.8, // Randomly feature some products
      isBestSeller: Math.random() > 0.8,
    }));
    
    allProducts = [...allProducts, ...products];
  }
  
  if (filter === "featured") {
    return allProducts.filter(p => p.isFeatured).slice(0, 8);
  }
  if (filter === "bestsellers") {
    return allProducts.filter(p => p.isBestSeller).slice(0, 8);
  }
  
  return allProducts;
}
