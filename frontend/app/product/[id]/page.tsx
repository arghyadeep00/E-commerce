import { getProductsById, getFeaturedProducts } from "@/data/product";
import ProductClient from "@/components/ProductClient";
import ProductCard from "@/components/ProductCard";
import { getReview } from "@/data/review";

import { Star } from "lucide-react";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let product = null;
  let relatedProducts = [];
  let reviews = [];
  try {
    product = await getProductsById(id);
    
    try {
      const featured = await getFeaturedProducts();
      relatedProducts = (Array.isArray(featured) ? featured : (featured?.products || []))
        .filter((p: any) => p._id !== id)
        .slice(0, 4);
    } catch (e) {
      console.log("Failed to fetch related products", e);
    }

    try {
      const reviewData = await getReview(id);
      reviews = Array.isArray(reviewData) ? reviewData : (reviewData?.reviews || []);
    } catch (e) {
      console.log("Failed to fetch reviews", e);
    }
  } catch (error) {
    console.error("Failed to fetch product", error);
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-16">
      <ProductClient product={product} />
      
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="pt-8 border-t">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review._id} className="border p-6 rounded-xl bg-card flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {review.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{review.user?.name || "Anonymous User"}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full">No reviews yet for this product.</p>
          )}
        </div>
      </section>
    </div>
  );
}
