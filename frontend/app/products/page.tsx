import { ProductCard } from "@/components/shop/ProductCard";
import productsData from "@/data/products.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata = {
  title: "Shop All Products | Antigravity",
  description: "Browse our complete collection of premium products.",
};

export default function ProductsPage() {
  const products = productsData;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">All Products</h1>
          <p className="text-muted-foreground">Showing {products.length} results</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-background"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Featured</DropdownMenuItem>
              <DropdownMenuItem>Newest Arrivals</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="md:hidden gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center justify-between hover:text-foreground cursor-pointer">
                <span>All Categories</span>
                <span>({products.length})</span>
              </li>
              <li className="flex items-center justify-between hover:text-foreground cursor-pointer">
                <span>Electronics</span>
                <span>(1)</span>
              </li>
              <li className="flex items-center justify-between hover:text-foreground cursor-pointer">
                <span>Wearables</span>
                <span>(1)</span>
              </li>
              <li className="flex items-center justify-between hover:text-foreground cursor-pointer">
                <span>Furniture</span>
                <span>(1)</span>
              </li>
              <li className="flex items-center justify-between hover:text-foreground cursor-pointer">
                <span>Computers</span>
                <span>(1)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Input type="number" placeholder="Min" className="h-9" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="Max" className="h-9" />
              </div>
              <Button className="w-full h-9">Apply</Button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
