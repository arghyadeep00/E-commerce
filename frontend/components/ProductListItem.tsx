"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCartAsync } from "@/lib/features/cart/cartSlice";
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
  features?: string[];
}

export default function ProductListItem({ product }: { product: ProductProps }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);
  const isInCart = cartItems?.some((item) => item._id === product._id);

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
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + window.location.pathname;
      return;
    }
    dispatch(
      addToCartAsync({
        productId: product._id,
        quantity: 1,
      }),
    );
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=shipping';
      return;
    }
    await dispatch(
      addToCartAsync({
        productId: product._id,
        quantity: 1,
      }),
    ).unwrap();
    router.push('/cart');
  };

  return (
    <Card 
      ref={cardRef}
      className={`group relative overflow-hidden border-border/50 bg-card transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 flex flex-col sm:flex-row p-0 rounded-xl ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}
    >
      {/* Left Column: Image */}
      <div className="w-full sm:w-62.5 shrink-0 bg-muted/10 relative border-b sm:border-b-0 sm:border-r border-border/50 flex flex-col justify-center">
        <Link href={`/product/${product._id}`} className="block h-full">
          <div className="w-full h-full p-6 flex items-center justify-center relative min-h-50">
            <Image
              src={
                product.thumbnail ||
                "https://placehold.co/400x400/png?text=Product"
              }
              alt={product.name}
              width={250}
              height={250}
              className="object-contain max-w-full max-h-50 transition-transform duration-700 group-hover:scale-105 drop-shadow-sm"
            />
          </div>
        </Link>
        
        {product.isNewArrival && (
          <Badge className="absolute top-3 left-3 z-10 px-2 py-0.5 font-semibold text-[10px] tracking-wide" variant="default">
            NEW
          </Badge>
        )}
        
        <Button
          variant="secondary"
          size="icon"
          className={`absolute top-3 right-3 z-10 transition-all duration-300 shadow-sm hover:text-red-500 hover:bg-white rounded-full bg-white/90 backdrop-blur-md ${isWishlisted ? 'opacity-100 text-red-500' : 'opacity-0 text-gray-500 group-hover:opacity-100'}`}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          <span className="sr-only">{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </Button>
      </div>
      
      {/* Middle Column: Details */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
        <Link href={`/product/${product._id}`} className="block group-hover:text-primary transition-colors duration-300">
          <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 bg-green-600 px-1.5 py-0.5 rounded text-white font-bold text-xs">
            <span>{product.rating ? product.rating.toFixed(1) : "0"}</span>
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            ({product.reviewCount || 0} Ratings)
          </span>
        </div>
        
        {product.features && product.features.length > 0 ? (
          <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
            {product.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="line-clamp-1">{feature}</li>
            ))}
          </ul>
        ) : product.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 max-w-xl">
            {product.description}
          </p>
        ) : null}
      </div>
      
      {/* Right Column: Price & Actions */}
      <div className="w-full sm:w-55 shrink-0 p-5 md:p-6 flex flex-col justify-center sm:border-l border-border/30 bg-muted/5">
        <div className="mb-6">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-foreground tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-muted-foreground line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-green-600">
                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off
              </span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">Free delivery</p>
        </div>
        
        <div className="mt-auto space-y-2">
          <Button
            className="w-full font-bold shadow-md hover:shadow-primary/25 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              handleBuyNow();
            }}
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            disabled={isInCart}
            className={`w-full border-primary/20 transition-colors duration-300 ${isInCart ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground' : 'text-primary hover:bg-primary/5'}`}
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> {isInCart ? "Already in Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
