"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-primary">
                Online Shop
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/brands"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Brands
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Products
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="h-10 w-56 rounded-full border border-input bg-transparent px-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                3
              </span>
              <span className="sr-only">
                <Link href="/cart">Cart</Link>
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <div className="flex flex-col space-y-3">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="h-9 w-full rounded-md border border-input bg-transparent px-8 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Link href="/products" className="text-sm font-medium">
              Shop
            </Link>
            <Link href="/categories" className="text-sm font-medium">
              Categories
            </Link>
            <Link href="/brands" className="text-sm font-medium">
              Brands
            </Link>
            <Link href="/best-sellers" className="text-sm font-medium">
              Best Sellers
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium pt-2 border-t mt-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
