"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  category: string;
  brand: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.isBestSeller && (
          <Badge
            variant="secondary"
            className="bg-white/90 text-black backdrop-blur-sm"
          >
            Best Seller
          </Badge>
        )}
        {product.compareAtPrice && (
          <Badge
            variant="destructive"
            className="bg-red-500/90 backdrop-blur-sm"
          >
            Sale
          </Badge>
        )}
      </div>

      <div className="absolute right-3 top-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>

      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden bg-gray-100 aspect-square relative"
      >
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-100">
            {/* Placeholder if no image */}
            <span className="text-sm">Product Image</span>
          </div>
        )}
      </Link>

      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">
          {product.brand}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 transition-transform active:scale-95">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
