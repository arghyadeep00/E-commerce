"use client";

import { useEffect, useState } from "react";
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCartAsync } from "@/lib/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/features/wishlist/wishlistSlice";

export default function ProductClient({ product }: { product: any }) {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.thumbnail);

  // Variant states
  const hasVariants = product.variants && product.variants.length > 0;
  const initialVariant = hasVariants ? product.variants[0] : null;
  const [selectedVariant, setSelectedVariant] = useState<any>(initialVariant);
  const [selectedColor, setSelectedColor] = useState<string>(initialVariant?.color || "");
  const [selectedStorage, setSelectedStorage] = useState<string>(initialVariant?.storage || "");
  const [selectedRam, setSelectedRam] = useState<string>(initialVariant?.ram || "");

  const uniqueColors = hasVariants ? Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean))) : [];
  const uniqueStorage = hasVariants ? Array.from(new Set(product.variants.map((v: any) => v.storage).filter(Boolean))) : [];
  const uniqueRam = hasVariants ? Array.from(new Set(product.variants.map((v: any) => v.ram).filter(Boolean))) : [];

  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);
  const isInCart = cartItems?.some((item) => item.productId === product._id && (!selectedVariant || item.variantId === selectedVariant._id));

  const handleWishlist = () => {
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
    // Determine selected variant based on selected attributes
    if (hasVariants) {
      const matched = product.variants.find(
        (v: any) => 
          (!selectedColor || v.color === selectedColor) &&
          (!selectedStorage || v.storage === selectedStorage) &&
          (!selectedRam || v.ram === selectedRam)
      );
      if (matched) {
        setSelectedVariant(matched);
      }
    }
  }, [selectedColor, selectedStorage, selectedRam, product.variants, hasVariants]);

  useEffect(() => {
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      setActiveImage(selectedVariant.images[0]);
    } else {
      setActiveImage(product.thumbnail);
    }
    setQuantity(1);
  }, [product._id, product.thumbnail, selectedVariant]);

  const images = (selectedVariant?.images?.length > 0) ? selectedVariant.images : (product.images?.length > 0 ? product.images : [product.thumbnail]);
  const stock = selectedVariant ? selectedVariant.stock : (product.stock || 0);
  const inStock = stock > 0;
  const atMax = quantity >= stock;
  const price = selectedVariant?.price || product.price;
  const compareAtPrice = product.compareAtPrice;
  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(100 - (price / compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + window.location.pathname;
      return;
    }
    dispatch(
      addToCartAsync({
        productId: product._id,
        variantId: selectedVariant?._id,
        color: selectedVariant?.color,
        storage: selectedVariant?.storage,
        ram: selectedVariant?.ram,
        quantity: quantity,
      }),
    );
  };

  return (
    <div className="grid grid-cols-1 items-center justify-items-center md:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
      {/* Image Gallery */}
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto md:mx-0">
        <div className="rounded-xl overflow-hidden border bg-muted/10 flex items-center justify-center aspect-square relative w-full">
          {discountPct !== null && (
            <Badge className="absolute top-3 left-3 z-10" variant="destructive">
              -{discountPct}%
            </Badge>
          )}
          <Image
            src={activeImage}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-full object-contain p-4"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                aria-label={`Show image ${idx + 1}`}
                aria-current={activeImage === img}
                className={`shrink-0 w-16 h-16 rounded-md border overflow-hidden bg-muted/10 transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                  activeImage === img ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                }`}
              >
                <Image src={img} alt="" width={64} height={64} className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col w-full max-w-2xl justify-center">
        <div className="mb-2 flex items-center gap-2 text-sm">
          {product.brand?.name && (
            <span className="text-muted-foreground uppercase tracking-wide font-medium">
              {product.brand.name}
            </span>
          )}
          {product.category?.name && <Badge variant="secondary">{product.category.name}</Badge>}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-0.5" role="img" aria-label={`${product.rating || 0} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/25"
                }`}
              />
            ))}
          </div>
          <button className="text-sm font-medium underline underline-offset-2 text-muted-foreground hover:text-foreground">
            {product.reviewCount || 0} reviews
          </button>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold tabular-nums">₹{price.toFixed(2)}</span>
          {discountPct !== null && (
            <span className="text-lg text-muted-foreground line-through tabular-nums">
              ₹{compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-sm mb-6">
          {inStock ? (
            <span className="text-emerald-600 font-medium">
              In stock — {stock} left
            </span>
          ) : (
            <span className="text-destructive font-medium">Out of stock</span>
          )}
        </p>

        {/* Variants UI */}
        {hasVariants && (
          <div className="flex flex-col gap-5 mb-8 border-b pb-8">
            {uniqueColors.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium">Color</span>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((color: any) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {uniqueStorage.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium">Storage</span>
                <div className="flex flex-wrap gap-2">
                  {uniqueStorage.map((storage: any) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedStorage === storage 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uniqueRam.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium">RAM</span>
                <div className="flex flex-wrap gap-2">
                  {uniqueRam.map((ram: any) => (
                    <button
                      key={ram}
                      onClick={() => setSelectedRam(ram)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedRam === ram 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity + Actions */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled={atMax || !inStock}
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              disabled={!inStock || isInCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" /> {isInCart ? "Already in cart" : "Add to cart"}
            </Button>
            <Button size="lg" variant="outline" className={`px-4 ${isWishlisted ? 'text-red-500 border-red-500/20 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20' : ''}`} aria-label="Save for later" onClick={handleWishlist}>
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Trust badges — only render what's actually true for this product */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-y py-4 text-sm text-muted-foreground mb-8">
          {product.freeShipping !== false && (
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Free shipping</span>
            </div>
          )}
          {product.returnPolicyDays !== 0 && (
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>{product.returnPolicyDays || 30}-day returns</span>
            </div>
          )}
          {product.warranty && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{product.warranty}</span>
            </div>
          )}
        </div>

        {/* Additional Info Tabs — description no longer duplicated below the fold */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
            >
              Description
            </TabsTrigger>
            {product.features?.length > 0 && (
              <TabsTrigger
                value="features"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                Features
              </TabsTrigger>
            )}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <TabsTrigger
                value="specs"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                Specifications
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description" className="pt-4 text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </TabsContent>

          {product.features?.length > 0 && (
            <TabsContent value="features" className="pt-4 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1.5">
                {product.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <TabsContent value="specs" className="pt-4 text-sm">
              <div className="border rounded-md divide-y">
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <div key={idx} className="grid grid-cols-3 p-3">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="col-span-2 text-muted-foreground">{String(value)}</span>
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