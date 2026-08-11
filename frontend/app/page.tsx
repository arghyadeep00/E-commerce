import Link from "next/link";
import Image from "next/image";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Zap, Mail, ShieldCheck, Star, Truck } from "lucide-react";
import { getFeaturedProducts, getNewArrivedProducts } from "@/data/product";
import { getCategory } from "@/data/category";
import { getBrands } from "@/data/Brand";

export default async function Home() {
  interface Categories {
    _id: string;
    name: string;
    logo?: string;
    image?: string;
    description: string;
  }
  interface Brands {
    _id: string;
    logo: string;
  }
  
  let featuredProducts: ProductProps[] = [];
  let newArrivals: ProductProps[] = [];
  let categoryData: Categories[] = [];
  let brands: Brands[] = [];

  try {
    const [
      featuredResponse,
      newArrivedResponse,
      getCategoryData,
      getBrandsdata,
    ] = await Promise.all([
      getFeaturedProducts(),
      getNewArrivedProducts(),
      getCategory(),
      getBrands(),
    ] as const);

    featuredProducts = Array.isArray(featuredResponse) ? featuredResponse : featuredResponse?.products || [];
    newArrivals = Array.isArray(newArrivedResponse) ? newArrivedResponse : newArrivedResponse?.products || [];
    categoryData = Array.isArray(getCategoryData) ? getCategoryData : getCategoryData?.categories || [];
    brands = Array.isArray(getBrandsdata) ? getBrandsdata : getBrandsdata?.brands || [];
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
  }

  // Fallback for empty state on Bento box
  const displayCategories = categoryData.length > 0 ? categoryData : [
    { _id: '1', name: 'Electronics', description: 'Tech for the future', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80' },
    { _id: '2', name: 'Fashion', description: 'Style redefined', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80' },
    { _id: '3', name: 'Home', description: 'Living spaces', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80' },
    { _id: '4', name: 'Accessories', description: 'The little things', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-slate-900 to-black z-0"></div>
        <div className="absolute inset-0 opacity-60 mix-blend-overlay bg-[url('/hero.png')] bg-cover bg-center z-0"></div>

        <div className="container relative z-10 md:px-8 flex flex-col justify-center items-start h-full mx-18">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Technology That <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
              Moves With You
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mb-10 font-light">
            Discover a curated collection of premium products designed to enhance your everyday experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 bg-white text-black hover:bg-slate-200 text-lg font-semibold transition-transform hover:scale-105">
                Shop Collection <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/category">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-lg font-medium transition-transform hover:scale-105">
                Explore Categories
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-10"></div>
      </section>

      {/* 2. Trust Bar (Brands) */}
      <section className="py-12 border-b bg-background relative z-20 -mt-4">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Trusted by the world's most innovative brands
          </p>
          <div className="relative overflow-hidden w-full group">
            <div className="flex animate-marquee-left-to-right group-hover:paused gap-12 md:gap-24 w-max items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
              {brands.length > 0 ? (
                [...brands, ...brands, ...brands].map((brand, index) => (
                  <div key={`${brand._id}-${index}`} className="w-24 md:w-32 h-12 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <Image src={brand.logo} alt="Brand" width={128} height={48} className="object-contain max-h-full" />
                  </div>
                ))
              ) : (
                <div className="flex gap-24 text-2xl font-bold text-slate-300">
                  <span>SONY</span><span>APPLE</span><span>SAMSUNG</span><span>NIKE</span><span>ADIDAS</span>
                  <span>SONY</span><span>APPLE</span><span>SAMSUNG</span><span>NIKE</span><span>ADIDAS</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">Free Global Shipping</h3>
            <p className="text-muted-foreground text-sm">On all orders over $150. Fast, secure, and trackable delivery worldwide.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
            <p className="text-muted-foreground text-sm">Protected by enterprise-grade encryption for complete peace of mind.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 transform -rotate-3">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Returns</h3>
            <p className="text-muted-foreground text-sm">Not completely satisfied? Return any item within 30 days hassle-free.</p>
          </div>
        </div>
      </section>

      {/* 3. Bento Box Categories */}
      <section className="py-24 container mx-auto px-4 md:px-8">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Curated Collections</h2>
            <p className="text-lg text-muted-foreground">Explore our hand-picked categories designed to match your unique taste and style.</p>
          </div>
          <Link href="/category">
            <Button variant="ghost" className="group font-semibold text-primary">
              View All Categories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-150">
          {displayCategories.slice(0, 4).map((category, index) => {
            // Create a bento box layout: first item large, others smaller
            let spanClass = "md:col-span-1 md:row-span-1";
            if (index === 0) spanClass = "md:col-span-2 md:row-span-2";
            else if (index === 3) spanClass = "md:col-span-2 md:row-span-1";

            const bgImage = category.image || 'https://images.unsplash.com/photo-1618220179428-22790b46a015?q=80&w=1000';

            return (
              <Link 
                href={`/category/${category.name.toLowerCase()}`} 
                key={category._id}
                className={`group relative rounded-3xl overflow-hidden min-h-62.5 ${spanClass}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    {category.description || 'Explore this collection'}
                  </p>
                  <div className="mt-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3 flex flex-col justify-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-orange-500 text-white mb-6 shadow-lg shadow-orange-500/20">
                <Zap className="w-8 h-8 fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">Trending <br className="hidden md:block"/> Right Now</h2>
              <p className="text-lg text-muted-foreground mb-8">
                The most sought-after products this week. Highly rated and selling fast—don't miss out on what everyone is talking about.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full w-full sm:w-auto h-12">
                  Shop All Featured
                </Button>
              </Link>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 3).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals (Dark Theme Vibe) */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-medium mb-3 uppercase tracking-wider text-sm">
                <TrendingUp className="w-5 h-5" /> Fresh Drops
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">New Arrivals</h2>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex rounded-full border-white/20 text-black hover:bg-white/10 hover:text-white bg-white">
                View All New Items
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <div key={product._id} className="dark">
                {/* Wrap in dark class so ProductCard looks good on dark bg if it supports dark mode */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <Link href="/products" className="md:hidden mt-8 block">
            <Button variant="outline" className="w-full rounded-full border-white/20 text-white hover:bg-white/10">
              View All New Items
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Newsletter / CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
            
            <div className="relative z-10 px-6 py-16 md:py-24 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="w-full md:w-1/2 text-center md:text-left text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Join our community</h2>
                <p className="text-blue-100 text-lg md:text-xl mb-0">
                  Subscribe to our newsletter and get 15% off your first order. Plus, receive exclusive offers and early access to new collections.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 max-w-md">
                <div className="flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <Button size="lg" className="rounded-xl bg-white text-indigo-600 hover:bg-slate-100 font-bold px-8">
                    Subscribe
                  </Button>
                </div>
                <p className="text-white/60 text-xs mt-4 text-center md:text-left">
                  By subscribing you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
