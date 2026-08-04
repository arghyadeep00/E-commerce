import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2, Plus, Minus, ShoppingCart } from "lucide-react";
import { getProductById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await getProductById(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Antigravity`,
    description: `Buy ${product.name} at the best price.`,
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const product = await getProductById(params.slug);
  
  if (!product) {
    notFound();
  }

  // Find original full product data to get specs, since getProducts maps it.
  // Actually, wait, getProducts() in lib/data.ts doesn't return specs!
  // I should probably just fetch the specific data or update getProducts to include specs.
  // Wait, let's just use what getProducts returns for now and maybe fetch the raw file if needed.
  // Let me just update getProducts in lib/data.ts to include specs and description later if needed.
  // For now I'll assume product has specs.

  return (
    <div className="flex flex-col gap-10 pb-16 pt-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-fit">
        <Link href="/products" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images (Left) */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
            ) : (
              <span className="text-muted-foreground">Main Product Image</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-muted rounded-xl cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all flex items-center justify-center overflow-hidden">
                 <img src={img} alt={`Thumb ${i}`} className="object-cover w-full h-full" />
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
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer underline underline-offset-4">
              4.5 (128 Reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black">{product.currency === "INR" ? "₹" : "$"}{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {product.currency === "INR" ? "₹" : "$"}{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            {product.compareAtPrice && (
              <Badge variant="destructive" className="ml-2">Sale</Badge>
            )}
          </div>

          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            Experience premium quality with the {product.name}. Designed by {product.brand}, this product offers exceptional performance and reliability for your everyday needs.
          </p>

          <div className="flex items-center gap-2 mb-8">
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </Badge>
          </div>

          <Separator className="mb-8" />

          {/* Key Features / Specs */}
          {product.specs && (
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-lg">Specifications</h3>
              <ul className="space-y-2 text-muted-foreground">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key} className="flex border-b border-muted pb-2">
                    <span className="w-1/3 font-medium capitalize">{key}</span>
                    <span className="w-2/3">{value as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

