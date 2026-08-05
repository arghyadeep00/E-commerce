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
  discountPrice?: number;
  image: string;
  rating: number;
  numReviews: number;
  isNew?: boolean;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.discountPrice || product.price,
      countInStock: 10, // Default for mock, should come from product prop ideally
      qty: 1
    }));
  };

  return (
    <Card className="group overflow-hidden border transition-all hover:shadow-md dark:hover:shadow-primary/10">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product._id}`}>
          <div className="overflow-hidden">
            <AspectRatio ratio={1}>
              {/* Using a standard img for now. In Next.js, next/image is preferred but requires domain config */}
              <img
                src={product.image || "https://placehold.co/400x400/png?text=Product"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
          </div>
        </Link>
        {product.isNew && (
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
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.numReviews})
          </span>
        </div>
        <CardTitle className="text-sm font-medium line-clamp-2 min-h-10 mb-2">
          <Link href={`/product/${product._id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.discountPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.discountPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2 transition-transform active:scale-95"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigating to product details if inside a Link
            handleAddToCart();
          }}
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
