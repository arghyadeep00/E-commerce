const API_URL = "http://localhost:5000/api";

export interface JsonProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  specs: any;
  stock: number;
  image: string;
  category: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface JsonCategoryData {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// Helper to map MongoDB Product to Frontend format
function mapProduct(p: any): JsonProduct {
  return {
    id: p.slug || p._id, // use slug as id for routing
    name: p.name,
    brand: p.brand?.name || "Unknown Brand",
    model: p.model || "",
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: p.currency || "USD",
    images: p.images || [],
    specs: p.specifications || {},
    stock: p.stock || 0,
    image: p.thumbnail || (p.images && p.images[0]) || "/placeholder.jpg",
    category: p.category?.name || "Uncategorized",
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
  };
}

export async function getCategories(): Promise<JsonCategoryData[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.map((c: any) => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      image: c.image || "/placeholder.jpg"
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getProductById(id: string): Promise<JsonProduct | null> {
  try {
    // id here is the slug from the url params
    const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();
    return mapProduct(data);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getProducts(filter?: "featured" | "bestsellers"): Promise<JsonProduct[]> {
  try {
    let url = `${API_URL}/products`;
    if (filter === "featured") url = `${API_URL}/products/featured`;
    if (filter === "bestsellers") url = `${API_URL}/products/best-sellers`;
    
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data.map(mapProduct);
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
