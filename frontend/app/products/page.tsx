"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        const prods = Array.isArray(data) ? data : data.products || [];
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch products", error);
        // Fallback placeholder data if backend fails
        const mock: ProductProps[] = Array.from({ length: 12 }).map((_, i) => ({
          _id: `prod-${i}`,
          name: `Premium Product ${i + 1}`,
          price: 49.99 + i * 15,
          rating: 3.5 + Math.random() * 1.5,
          numReviews: Math.floor(Math.random() * 200),
          image: `https://placehold.co/400x400/png?text=Product+${i+1}`,
        }));
        setProducts(mock);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["All", "Electronics", "Clothing", "Home", "Sports"];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-card border rounded-lg p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Button 
                      variant={category === cat ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {/* Pagination Placeholder */}
          {!loading && products.length > 0 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
