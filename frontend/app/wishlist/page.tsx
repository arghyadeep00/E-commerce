"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchWishlist } from "@/lib/features/wishlist/wishlistSlice";
import ProductCard from "@/components/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, loading, error } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=wishlist");
    } else {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch, router]);

  if (!isAuthenticated) {
    return null; // redirecting
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="p-3 bg-red-100 text-red-500 rounded-full">
          <Heart className="h-6 w-6" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center max-w-lg mx-auto">
          <p className="font-semibold mb-2">Error loading wishlist</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/30">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-6" />
          <h2 className="text-2xl font-semibold mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You haven't saved any items yet. Browse our collection and click the heart icon to save items you love.
          </p>
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
