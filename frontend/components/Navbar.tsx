"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Zap,
  Package,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  fetchWishlist,
  clearWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { fetchCart, clearCartOnLogout } from "@/lib/features/cart/cartSlice";
import {
  fetchAddresses,
  clearAddressesOnLogout,
} from "@/lib/features/address/addressSlice";
import { useEffect, useState } from "react";
import { getCategory } from "@/data/category";

interface Category {
  _id: string;
  name: string;
}

// Helper to map dynamic category names to icons
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("mobile") || lowerName.includes("phone"))
    return Smartphone;
  if (lowerName.includes("laptop") || lowerName.includes("pc")) return Laptop;
  if (lowerName.includes("tablet") || lowerName.includes("ipad")) return Tablet;
  if (
    lowerName.includes("audio") ||
    lowerName.includes("headphone") ||
    lowerName.includes("access")
  )
    return Headphones;
  return Package;
};

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<
    { name: string; icon: any; href: string; special?: boolean }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
      dispatch(fetchAddresses());
    } else {
      dispatch(clearWishlist());
      dispatch(clearCartOnLogout());
      dispatch(clearAddressesOnLogout());
    }
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategory();
        const cats = Array.isArray(response)
          ? response
          : response?.categories || [];

        // Map dynamic categories to navbar format
        const mappedCats = cats.map((c: Category) => ({
          name: c.name,
          icon: getCategoryIcon(c.name),
          href: `/category/${c.name.toLowerCase()}`,
        }));

        // Always append Deals at the end
        setDynamicCategories([...mappedCats]);
      } catch (err) {
        console.error("Failed to fetch categories for navbar", err);
        // Fallback to defaults
        setDynamicCategories([
          { name: "Mobiles", icon: Smartphone, href: "/category/mobiles" },
          { name: "Laptops", icon: Laptop, href: "/category/laptops" },
          { name: "Tablets", icon: Tablet, href: "/category/tablets" },
          {
            name: "Accessories",
            icon: Headphones,
            href: "/category/accessories",
          },
          { name: "Deals", icon: Zap, href: "/deals", special: true },
        ]);
      }
    };
    fetchCats();
  }, []);

  const renderCategories = () =>
    dynamicCategories.length > 0 ? (
      dynamicCategories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.name}
            href={cat.href}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              cat.special
                ? "text-destructive hover:text-destructive/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {cat.name}
          </Link>
        );
      })
    ) : (
      <div className="flex gap-6 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-20 bg-muted rounded"></div>
        ))}
      </div>
    );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-background border-b border-border/40"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                NexaMart
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl hidden md:block mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for smartphones, laptops, audio..."
                className="block w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-transparent rounded-full text-sm focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none placeholder:text-muted-foreground/70"
              />
            </form>
          </div>

          {/* Right: User Actions */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <Link
              href="/wishlist"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "relative rounded-full hover:bg-muted/80",
              })}
            >
              <Heart className="h-5 w-5" />
              {mounted &&
                isAuthenticated &&
                wishlistItems &&
                wishlistItems.length > 0 && (
                  <span className="absolute 2 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background animate-in zoom-in">
                    {wishlistItems.length}
                  </span>
                )}
              <span className="sr-only">Wishlist</span>
            </Link>

            <Link
              href="/cart"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "relative rounded-full hover:bg-muted/80",
              })}
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItems && cartItems.length > 0 && (
                <span className="absolute 2 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>

            <Link
              href={!mounted || !isAuthenticated ? "/login" : "/profile"}
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "rounded-full hover:bg-muted/80",
              })}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>

            <div className="pl-2 border-l border-border/50 hidden sm:block">
              <ThemeToggle />
            </div>
          </nav>
        </div>

        {/* Bottom Nav: Category Links (Desktop) */}
        <div
          className={`hidden md:flex items-center gap-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isScrolled ? "max-h-0 opacity-0 pb-0" : "max-h-16 opacity-100 pb-3"
          }`}
        >
          {renderCategories()}
        </div>
      </div>
    </header>
  );
}
