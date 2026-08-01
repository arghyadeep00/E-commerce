import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2, Plus, Minus, ShoppingCart } from "lucide-react";
import productsData from "@/data/products.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props) {
  const product = productsData.find((p) => p.id === params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Antigravity`,
    description: product.description,
  };
}

export default function ProductDetailsPage({ params }: Props) {
  const product = productsData.find((p) => p.id === params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 pb-16 pt-4">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images (Left) */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative flex items-center justify-center">
            {/* Main Image Placeholder */}
            <span className="text-muted-foreground">Main Product Image</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all flex items-center justify-center">
                 <span className="text-xs text-muted-foreground">Thumb {i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info (Right) */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary font-semibold mb-2">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer underline underline-offset-4">
              {product.reviews} Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            {product.compareAtPrice && (
              <Badge variant="destructive" className="ml-2">Sale</Badge>
            )}
          </div>

          <p className="text-base text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <Separator className="mb-8" />

          {/* Key Features */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4 text-lg">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart Area */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border rounded-md h-12 w-32 justify-between px-3">
              <button className="text-muted-foreground hover:text-foreground p-1"><Minus className="h-4 w-4" /></button>
              <span className="font-semibold">1</span>
              <button className="text-muted-foreground hover:text-foreground p-1"><Plus className="h-4 w-4" /></button>
            </div>
            <Button size="lg" className="flex-1 h-12 gap-2 text-base">
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-sm">2 Year Warranty</p>
                <p className="text-xs text-muted-foreground">100% guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
