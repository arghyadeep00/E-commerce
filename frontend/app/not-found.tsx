import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-8 text-center bg-background">
      <div className="relative">
        {/* Background decorative blob */}
        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        
        {/* Main Icon */}
        <div className="relative bg-card border shadow-lg rounded-3xl p-6 mb-8 flex items-center justify-center">
          <SearchX className="h-20 w-20 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-4 drop-shadow-sm">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Page not found
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-base md:text-lg">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/" 
          className={buttonVariants({ size: "lg", className: "gap-2 w-full sm:w-auto shadow-md" })}
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link 
          href="/products" 
          className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2 w-full sm:w-auto" })}
        >
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
