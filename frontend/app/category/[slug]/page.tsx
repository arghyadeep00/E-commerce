import Link from "next/link";
import { getProductsByCategory } from "@/data/product";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import { ArrowRight, PackageX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryBySlug } from "@/data/category";

interface CategoryInfo {
  _id?: string;
  name: string;
  description?: string;
  banner?: string;
  icon?: string;
  highlight?: string;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let products: ProductProps[] = [];
  let categoryInfo: CategoryInfo | null = null;

  try {
    categoryInfo = await getCategoryBySlug(slug);
    const data = await getProductsByCategory(slug);
    products = Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("Failed to fetch data for category page:", error);
  }

  const title = categoryInfo?.name || slug.replace(/-/g, " ");
  const description =
    categoryInfo?.description ||
    "Discover curated products handpicked for this category. Shop top-rated items and latest arrivals.";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-muted">
        <div className="absolute inset-0">
          {categoryInfo?.banner ? (
            <img
              src={categoryInfo.banner}
              alt={`${title} background`}
              className="h-full w-full object-cover opacity-90"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-r from-primary/10 via-background to-secondary/10" />
          )}
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-background" />
        <div className="relative container mx-auto px-4 md:px-8 py-16 md:py-24">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/category" className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-[1fr_320px] items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm backdrop-blur">
                {categoryInfo?.icon ? (
                  <img
                    src={categoryInfo.icon}
                    alt={`${title} icon`}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {title.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold">{title}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-md">
                  {title}
                </h1>
                <p className="max-w-3xl text-base md:text-lg text-muted-foreground leading-8">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/products" className={buttonVariants({ variant: "default" })}>
                  Browse All Products
                </Link>
                <Link href="/wishlist" className={buttonVariants({ variant: "ghost" })}>
                  View Wishlist <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold">
                  {products.length}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products available</p>
                  <p className="text-xl font-semibold text-foreground">{products.length}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-3">
                  <span>Fast delivery</span>
                  <span className="font-semibold text-foreground">Ready to Ship</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Secure payments</span>
                  <span className="font-semibold text-foreground">Verified</span>
                </div>
                <div className="rounded-2xl bg-muted/80 p-4 text-center text-xs font-medium text-foreground">
                  Curated selection of the best items in {title}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary/80 font-semibold mb-2">
              Category Collection
            </p>
            <h2 className="text-3xl font-bold text-foreground">Top Picks</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-4 py-2">Featured</span>
            <span className="rounded-full border border-border bg-card px-4 py-2">Popular</span>
            <span className="rounded-full border border-border bg-card px-4 py-2">New Arrivals</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-muted/40 bg-muted/20 p-12 text-center">
            <PackageX className="mx-auto mb-6 h-16 w-16 text-muted-foreground/60" />
            <h2 className="text-2xl font-semibold text-foreground mb-3">No products available</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We couldn't find products in this category yet. Explore more categories or browse the complete store for similar items.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className={buttonVariants()}>
                Browse All Products
              </Link>
              <Link href="/categories" className={buttonVariants({ variant: "outline" })}>
                Explore Categories
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
