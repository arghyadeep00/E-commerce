"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import { Loader2, Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ProductsBrowserProps {
  initialCategoryId?: string;
  hideCategoryFilter?: boolean;
  hideHeader?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ProductsBrowser({
  initialCategoryId = "All",
  hideCategoryFilter = false,
  hideHeader = false,
  title = "All Products",
  subtitle = "Showing products",
}: ProductsBrowserProps) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter Options (Data from backend)
  const [categories, setCategories] = useState<{_id: string; name: string}[]>([]);
  const [brands, setBrands] = useState<{_id: string; name: string}[]>([]);
  
  // Selected Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  
  // View mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch Categories & Brands on Mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands")
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    };
    if (!hideCategoryFilter) fetchFilters();
    else {
      // still fetch brands if category is hidden
      api.get("/brands").then(res => setBrands(res.data)).catch(console.error);
    }
  }, [hideCategoryFilter]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedBrand !== "All") params.append("brand", selectedBrand);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("sort", sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      const prods = Array.isArray(data) ? data : data.products || [];
      setProducts(prods);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, sort]);

  // Initial fetch and fetch on sort change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, sort]);

  const handleApplyFilters = () => {
    fetchProducts();
    setIsSidebarOpen(false); // close mobile sidebar if open
  };

  const handleResetFilters = () => {
    if (!hideCategoryFilter) setSelectedCategory(initialCategoryId);
    setSelectedBrand("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  return (
    <div className={!hideHeader ? "container mx-auto px-4 md:px-8 py-8" : "w-full"}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        {!hideHeader ? (
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle.replace('products', products.length + ' products')}</p>
          </div>
        ) : (
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Products ({products.length})</h2>
          </div>
        )}
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="md:hidden flex-1"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
          
          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <div className="hidden md:flex items-center gap-1 border border-input rounded-md p-1 mr-2 bg-background">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Label htmlFor="sort" className="whitespace-nowrap hidden md:inline-block">Sort by:</Label>
            <div className="relative w-full md:w-[180px]">
              <select 
                id="sort"
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`w-full md:w-1/4 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-card border rounded-xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </h3>
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-muted-foreground hover:text-foreground h-8 px-2">
                Reset
              </Button>
            </div>

            {!hideCategoryFilter && (
              <div className="mb-6">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Categories</h4>
                <ul className="space-y-1 max-h-48 overflow-y-auto pr-2">
                  <li>
                    <Button
                      variant={selectedCategory === "All" ? "secondary" : "ghost"}
                      className="w-full justify-start h-9"
                      onClick={() => setSelectedCategory("All")}
                    >
                      All Categories
                    </Button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Button
                        variant={selectedCategory === cat._id ? "secondary" : "ghost"}
                        className="w-full justify-start h-9"
                        onClick={() => setSelectedCategory(cat._id)}
                      >
                        {cat.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Brands</h4>
              <ul className="space-y-1 max-h-48 overflow-y-auto pr-2">
                <li>
                  <Button
                    variant={selectedBrand === "All" ? "secondary" : "ghost"}
                    className="w-full justify-start h-9"
                    onClick={() => setSelectedBrand("All")}
                  >
                    All Brands
                  </Button>
                </li>
                {brands.map((brand) => (
                  <li key={brand._id}>
                    <Button
                      variant={selectedBrand === brand._id ? "secondary" : "ghost"}
                      className="w-full justify-start h-9"
                      onClick={() => setSelectedBrand(brand._id)}
                    >
                      {brand.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-9"
                  min="0"
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9"
                  min="0"
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting your categories, brands, or price range.
              </p>
              <Button variant="outline" onClick={handleResetFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {products.map((product) => (
                viewMode === "grid" 
                  ? <ProductCard key={product._id} product={product} />
                  : <ProductListItem key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
