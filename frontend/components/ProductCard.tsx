"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/features/wishlist/wishlistSlice";

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
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + window.location.pathname;
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

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
      className={`group relative overflow-hidden border-border/50 bg-card transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 flex flex-col p-0 rounded-2xl ${isVisible ? 'animate-fade-in-down' : 'opacity-0'} hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardHeader className="p-0 relative bg-muted/20">
        <Link href={`/product/${product._id}`}>
          <div className="overflow-hidden relative">
            <AspectRatio ratio={1}>
              <div className="w-full h-full p-6 flex items-center justify-center rounded-2xl">
                <Image
                  src={
                    product.thumbnail ||
                    "https://placehold.co/400x400/png?text=Product"
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-contain max-w-full max-h-full drop-shadow-md transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </AspectRatio>
            {/* Dark overlay on hover for image */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        
        {product.isNewArrival && (
          <Badge className="absolute top-3 left-3 z-10 px-2.5 py-0.5 font-semibold tracking-wide" variant="default">
            NEW
          </Badge>
        )}
        
        <Button
          variant="secondary"
          size="icon"
          className={`absolute top-3 right-3 z-10 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm hover:text-red-500 hover:bg-white rounded-full bg-white/90 backdrop-blur-md ${isWishlisted ? 'opacity-100 text-red-500' : 'opacity-0 text-gray-600 group-hover:opacity-100'}`}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          <span className="sr-only">{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </Button>
      </CardHeader>
      
      <CardContent className="p-5 grow flex flex-col relative z-10 bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="text-xs font-medium text-muted-foreground ml-1.5">
              ({product.reviewCount || 0})
            </span>
          </div>
          
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-muted-foreground/20">
            In Stock
          </Badge>
        </div>
        
        <CardTitle className="text-lg font-bold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
          <Link href={`/product/${product._id}`}>
            {product.name}
          </Link>
        </CardTitle>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto flex items-end gap-2 pt-4">
          <span className="text-2xl font-black text-foreground tracking-tight">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm font-medium text-muted-foreground line-through mb-1">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex gap-3 relative z-10 bg-card">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 h-11 w-11 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          title="Add to Cart"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <Button
          className="w-[80%] h-11 rounded-xl font-bold tracking-wide shadow-md hover:shadow-primary/25 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
