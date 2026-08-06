import Link from "next/link";
import api from "@/lib/api";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

    const featured = Array.isArray(featuredResponse)
      ? featuredResponse
      : featuredResponse?.products || [];

    const newArrivedproducts = Array.isArray(newArrivedResponse)
      ? newArrivedResponse
      : newArrivedResponse?.products || [];

    featuredProducts = featured;
    newArrivals = newArrivedproducts;
    categoryData = Array.isArray(getCategoryData) ? getCategoryData : (getCategoryData?.categories || []);
    brands = Array.isArray(getBrandsdata) ? getBrandsdata : (getBrandsdata?.brands || []);
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
    // Provide fallback mock data so the page isn't empty if the backend is down
  }

  const banners = [
    {
      id: 1,
      title: "Summer Collection",
      desc: "Up to 50% off on all summer wear.",
      bg: "bg-gradient-to-r from-cyan-500 to-blue-500",
    },
    {
      id: 2,
      title: "New Electronics",
      desc: "Upgrade your tech today.",
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Home Essentials",
      desc: "Make your house a home.",
      bg: "bg-gradient-to-r from-orange-400 to-rose-400",
    },
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
                  <div
                    className={`p-12 md:p-24 flex flex-col items-start justify-center h-75 md:h-100 ${banner.bg} text-white`}
                  >
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                      {banner.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-md">
                      {banner.desc}
                    </p>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-full font-semibold"
                    >
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

      {/* Categories */}
      <section className="py-12 container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/categories"
            className={buttonVariants({ variant: "link" })}
          >
            View All Categories
          </Link>
        </div>

        <div className="relative overflow-hidden w-full group py-2">
          <div className="flex animate-marquee-right-to-lef group-hover:paused gap-4 w-max">
            {[...categoryData.slice(0, 10), ...categoryData.slice(0, 10)].map((category, index) => (
              <Link
                key={`${category._id}-${index}`}
                href={`/category/${category.name.toLowerCase()}`}
                className="group/link flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md w-37.5 md:w-50 shrink-0"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:scale-110 transition-transform">
                  {/* Fallback icon or image */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                  )}
                </div>
                <h3 className="font-semibold text-center text-sm">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Logos */}
      <section className="py-12 container mx-auto px-4 md:px-8 border-y bg-muted/10 my-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-8 text-center text-muted-foreground">
          Trusted by Top Brands
        </h2>
        <div className="relative overflow-hidden w-full group py-4">
          <div className="flex animate-marquee-left-to-right group-hover:paused gap-8 md:gap-16 w-max items-center pr-8 md:pr-16">
            {brands.length > 0 ? (
              [...brands, ...brands].map((brand, index) => (
                <div key={`${brand._id}-${index}`} className="w-24 h-12 md:w-32 md:h-16 relative flex items-center justify-center  transition-all duration-300 shrink-0">
                  <img
                    src={brand.logo}
                    alt="Brand Logo"
                    className="max-w-full max-h-full object-contain drop-shadow-sm"
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm w-full text-center pr-0">No brands found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" /> Featured Products
          </h2>
          <Link
            href="/products"
            className={buttonVariants({ variant: "link" })}
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" /> New Arrivals
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
