"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, User, Menu, Heart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./ui/button";
import { useAppSelector } from "@/lib/hooks";

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 gap-4">
        {/* 1st Section: Mobile Menu & Logo */}
        <div className="flex items-center">
          <div className="flex items-center md:hidden mr-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <Link href="/" className="font-bold text-2xl tracking-tight text-primary">
            NexaMart
          </Link>
        </div>

        {/* 2nd Section: Search Bar (Desktop) */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center bg-muted/50 focus-within:bg-muted border border-transparent focus-within:border-primary/30 rounded-full px-4 py-2 transition-all">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search for products, brands, or categories..."
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70"
          />
        </div>

        {/* 3rd Section: User Actions */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Link
            href="/wishlist"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Link>

          <Link
            href="/cart"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "relative rounded-full" })}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems && cartItems.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartItems.length}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Link>

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Link>
          
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
