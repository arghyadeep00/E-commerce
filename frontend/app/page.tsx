import Link from "next/link";
import Image from "next/image";
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
    categoryData = Array.isArray(getCategoryData)
      ? getCategoryData
      : getCategoryData?.categories || [];
    brands = Array.isArray(getBrandsdata)
      ? getBrandsdata
      : getBrandsdata?.brands || [];
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
    // Provide fallback mock data so the page isn't empty if the backend is down
  }

  const banners = [
    {
      id: 1,
      title: "Summer Collection",
      desc: "Up to 50% off on all summer wear.",
      bg: "https://rukminim2.flixcart.com/fk-p-flap/3140/700/image/9cc48dfdb94404b5.png?q=60",
    },
    {
      id: 2,
      title: "New Electronics",
      desc: "Upgrade your tech today.",
      bg: "https://rukminim2.flixcart.com/fk-p-flap/3140/700/image/9cc48dfdb94404b5.png?q=60",
    },
    {
      id: 3,
      title: "Home Essentials",
      desc: "Make your house a home.",
      bg: "https://rukminim2.flixcart.com/fk-p-flap/3140/700/image/9cc48dfdb94404b5.png?q=60",
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
                    className="p-12 md:p-24 flex flex-col items-start justify-center min-h-75 md:min-h-100 text-white relative rounded-xl overflow-hidden"
                    style={{
                      backgroundImage: `url(${banner.bg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

                    <div className="relative z-10 w-full flex flex-col items-start">
                      <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-xl mb-8 opacity-95 max-w-md drop-shadow-md">
                        {banner.desc}
                      </p>
                      <Button
                        variant="default"
                        size="lg"
                        className="rounded-full font-semibold shadow-lg bg-white text-black hover:bg-gray-100"
                      >
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
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
            href="/category"
            className={buttonVariants({ variant: "link" })}
          >
            View All Categories
          </Link>
        </div>

        <div className="relative overflow-hidden w-full group py-2">
          <div className="flex animate-marquee-right-to-lef group-hover:paused gap-4 w-max">
            {[...categoryData.slice(0, 10), ...categoryData.slice(0, 10)].map(
              (category, index) => (
                <Link
                  key={`${category._id}-${index}`}
                  href={`/category/${category.name.toLowerCase()}`}
                  className="group/link flex flex-col items-center justify-center p-6 border rounded-xl bg-card hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md w-37.5 md:w-50 shrink-0"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:scale-110 transition-transform">
                    {/* Fallback icon or image */}
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
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
              ),
            )}
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
                <div
                  key={`${brand._id}-${index}`}
                  className="w-24 h-12 md:w-32 md:h-16 relative flex items-center justify-center  transition-all duration-300 shrink-0"
                >
                  <Image
                    src={brand.logo}
                    alt="Brand Logo"
                    width={128}
                    height={64}
                    className="max-w-full max-h-full object-contain drop-shadow-sm"
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm w-full text-center pr-0">
                No brands found.
              </p>
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
