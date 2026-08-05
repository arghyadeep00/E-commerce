"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Loader2, TrendingUp, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from backend. Assuming /products returns an array or object with products
        const { data } = await api.get("/products");
        const products = Array.isArray(data) ? data : data.products || [];
        
        // Mock sorting for demo purposes if backend doesn't support it directly
        setFeaturedProducts(products.slice(0, 4));
        setNewArrivals(products.slice(4, 8).map((p: any) => ({ ...p, isNew: true })));
      } catch (error) {
        console.error("Failed to fetch products", error);
        // Fallback placeholder data if backend fails
        const mock: ProductProps[] = Array.from({ length: 8 }).map((_, i) => ({
          _id: `prod-${i}`,
          name: `Premium Product ${i + 1}`,
          price: 99.99 + i * 10,
          rating: 4 + Math.random(),
          numReviews: Math.floor(Math.random() * 100),
          image: `https://placehold.co/400x400/png?text=Product+${i+1}`,
          isNew: i > 3
        }));
        setFeaturedProducts(mock.slice(0, 4));
        setNewArrivals(mock.slice(4, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const banners = [
    { id: 1, title: "Summer Collection", desc: "Up to 50% off on all summer wear.", bg: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { id: 2, title: "New Electronics", desc: "Upgrade your tech today.", bg: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: 3, title: "Home Essentials", desc: "Make your house a home.", bg: "bg-gradient-to-r from-orange-400 to-rose-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="w-full bg-muted/30 pt-4 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <Carousel className="w-full relative rounded-xl overflow-hidden shadow-lg">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className={`p-12 md:p-24 flex flex-col items-start justify-center h-75 md:h-100 ${banner.bg} text-white`}>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">{banner.title}</h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-md">{banner.desc}</p>
                    <Button variant="secondary" size="lg" className="rounded-full font-semibold">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" /> Featured Products
          </h2>
          <Link href="/products" className={buttonVariants({ variant: "link" })}>
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" /> New Arrivals
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
