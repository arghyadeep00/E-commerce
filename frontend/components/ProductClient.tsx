"use client";

import { useState } from "react";
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cart/cartSlice";

export default function ProductClient({ product }: { product: any }) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.thumbnail);

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.thumbnail, // mapped correctly to thumbnail
        price: product.price,
        countInStock: product.stock, // mapped to stock
        qty: quantity,
      }),
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-8 aspect-square relative">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain rounded-lg shadow-sm"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-muted/20 ${
                  activeImage === img ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          {product.brand && (
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              {product.brand.name || "Brand"}
            </span>
          )}
          {product.category && <Badge variant="secondary">{product.category.name || "Category"}</Badge>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium underline cursor-pointer">
            {product.reviewCount || 0} Reviews
          </span>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <div className="text-3xl font-extrabold">₹{product.price.toFixed(2)}</div>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="text-xl text-muted-foreground line-through mb-1">
              ₹{product.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>

        <p className="text-muted-foreground mb-8 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Add to Cart Actions */}
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
              >
                +
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {(product.stock || 0) > 0 ? (
                `${product.stock} items in stock`
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </span>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 gap-2 text-lg"
              disabled={(product.stock || 0) === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="px-4">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6 text-sm mb-8">
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
            <span>{product.warranty || "2 Year Warranty"}</span>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Description
            </TabsTrigger>
            {product.features?.length > 0 && (
              <TabsTrigger
                value="features"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
              >
                Features
              </TabsTrigger>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <TabsTrigger
                value="specs"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
              >
                Specifications
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="description" className="pt-4 text-muted-foreground leading-relaxed">
            {product.description}
          </TabsContent>
          
          {product.features?.length > 0 && (
            <TabsContent value="features" className="pt-4 text-muted-foreground">
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
          )}
          
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <TabsContent value="specs" className="pt-4 text-muted-foreground">
              <div className="border rounded-md divide-y">
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <div key={idx} className="flex grid grid-cols-3 p-3">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="col-span-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

      </div>
    </div>
  );
}
