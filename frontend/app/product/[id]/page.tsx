"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { Loader2, Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cart/cartSlice";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
        // Fallback mock
        setProduct({
          _id: id,
          name: "Premium Wireless Headphones with Active Noise Cancellation",
          price: 299.99,
          description: "Experience industry-leading noise cancellation and breathtaking sound quality with our latest premium wireless headphones. Designed for all-day comfort with up to 30 hours of battery life.",
          rating: 4.8,
          numReviews: 124,
          countInStock: 15,
          image: "https://placehold.co/600x600/png?text=Product+Image",
          brand: "AudioTech",
          category: "Electronics"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-xl font-semibold">Product not found</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: quantity
    }));
    // Optional: show a toast notification here
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-8">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto max-w-md object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{product.brand}</span>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium underline cursor-pointer">{product.numReviews} Reviews</span>
          </div>

          <div className="text-3xl font-extrabold mb-6">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Add to Cart Actions */}
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}>+</Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.countInStock > 0 ? `${product.countInStock} items in stock` : <span className="text-destructive font-medium">Out of Stock</span>}
              </span>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 gap-2 text-lg" disabled={product.countInStock === 0} onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="px-4">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span>2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
