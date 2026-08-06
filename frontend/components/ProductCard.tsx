"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cart/cartSlice";

export interface ProductProps {
  _id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  description?: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.thumbnail,
        price: product.price,
        countInStock: 10,
        qty: 1,
      }),
    );
  };

  return (
    <Card 
      ref={cardRef}
      className={`group overflow-hidden border transition-all hover:shadow-md dark:hover:shadow-primary/10 flex flex-col p-0 ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}
    >
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product._id}`}>
          <div className="overflow-hidden">
            <AspectRatio ratio={1}>
              <img
                src={
                  product.thumbnail ||
                  "https://placehold.co/400x400/png?text=Product"
                }
                alt={product.name}
                className="object-contain w-full h-full rounded-3xl p-4 transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
          </div>
        </Link>
        {product.isNewArrival && (
          <Badge className="absolute top-2 left-2 z-10" variant="default">
            New
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to Wishlist</span>
        </Button>
      </CardHeader>
      <CardContent className=" grow">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating || 0)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>
        <CardTitle className="text-base font-bold line-clamp-1 mb-1">
          <Link href={`/product/${product._id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xl font-extrabold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-3 flex flex-col gap-3">
        <Button
          className="w-full gap-2 transition-transform active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          <ShoppingCart className="h-4 w-4" /> Buy Now
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2 transition-transform active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
