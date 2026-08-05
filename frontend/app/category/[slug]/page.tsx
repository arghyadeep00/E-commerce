import Link from "next/link";
import { getProductsByCategory } from "@/data/product";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { PackageX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryBySlug } from "@/data/category";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let products: ProductProps[] = [];
  let categoryInfo: any = null;

  try {
    categoryInfo = await getCategoryBySlug(slug);

    // Fetch products for this category
    const data = await getProductsByCategory(slug);
    products = data.products || [];
  } catch (error) {
    console.error("Failed to fetch data for category page:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Category Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted overflow-hidden">
        {categoryInfo?.banner ? (
          <img
            src={categoryInfo.banner}
            alt={`${categoryInfo.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        
        {/* Header Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto flex items-end gap-6">
            {categoryInfo?.icon && (
              <div className="hidden md:flex w-24 h-24 rounded-2xl bg-background shadow-lg p-2 items-center justify-center border">
                <img
                  src={categoryInfo.icon}
                  alt={`${categoryInfo.name} icon`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight capitalize text-foreground mb-2 drop-shadow-md">
                {categoryInfo ? categoryInfo.name : slug.replace("-", " ")}
              </h1>
              {categoryInfo?.description && (
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl drop-shadow-sm font-medium">
                  {categoryInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Products in {categoryInfo?.name || "this category"}</h2>
          <span className="text-muted-foreground font-medium">{products.length} Items</span>
        </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border rounded-xl bg-muted/20 border-dashed">
          <PackageX className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We couldn't find any products in this category at the moment. Please
            check back later.
          </p>
          <Link href="/products" className={buttonVariants()}>
            Browse All Products
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
