import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryCard } from "@/components/shop/CategoryCard";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";


export default function Home() {
  const featuredProducts = productsData.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = productsData.filter((p) => p.isBestSeller).slice(0, 4);
  const categories = categoriesData.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-muted/40 px-6 py-24 sm:px-12 sm:py-32 lg:px-24">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Elevate Your <span className="text-primary">Lifestyle</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover our curated collection of premium products. Minimalist design meets exceptional quality.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <Link href="/categories" className="flex items-center text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <Link href="/products?filter=featured" className="flex items-center text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotional Banner / Flash Sale */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 sm:py-24 text-primary-foreground">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
            Summer Flash Sale
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Get up to 50% off on selected premium items. Offer ends soon.
          </p>
          <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary" asChild>
            <Link href="/products?sale=true">Shop the Sale</Link>
          </Button>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
          <Link href="/products?filter=bestsellers" className="flex items-center text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
