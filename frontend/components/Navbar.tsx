"use client";
import Link from "next/link";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./ui/button";
import { useAppSelector } from "@/lib/hooks";

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        
        {/* Mobile Menu */}
        <div className="flex items-center md:hidden mr-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="mr-8 flex items-center space-x-2">
          <Link href="/" className="font-bold text-xl tracking-tight">
            NexaMart
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Products
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Categories
          </Link>
          <Link href="/brands" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Brands
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm hidden md:flex items-center space-x-2 bg-muted rounded-md px-3 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent border-none outline-none text-sm p-1"
            />
          </div>
          <nav className="flex items-center space-x-2">
            <Link 
              href="/cart" 
              className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                3
              </span>
              <span className="sr-only">Cart</span>
            </Link>
            <Link 
              href={isAuthenticated ? "/profile" : "/login"}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
