import Link from "next/link";
import Image from "next/image";
import { getCategory } from "@/data/category";
import { ArrowRight, Layers } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface Category {
  _id: string;
  name: string;
  logo?: string;
  image?: string;
  description: string;
}

export default async function CategoryPage() {
  let categories: Category[] = [];

  try {
    const data = await getCategory();
    categories = Array.isArray(data) ? data : data?.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="bg-muted/30 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of products grouped by category. Find exactly what you're looking for with our curated collections.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 md:px-8 flex-1">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.name.toLowerCase()}`}
                className="group flex flex-col h-full overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <div className="aspect-4/3 bg-muted/50 overflow-hidden relative flex items-center justify-center p-6">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {category.description || `Discover our collection of ${category.name}.`}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary mt-auto">
                    Explore Category <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-3xl border border-dashed border-muted/50 bg-muted/10">
            <h2 className="text-2xl font-semibold mb-3">No Categories Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't load any categories at this time. Please check back later.
            </p>
            <Link href="/" className={buttonVariants({ variant: "default" })}>
              Return Home
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
