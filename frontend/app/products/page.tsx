"use client";

import ProductsBrowser from "@/components/ProductsBrowser";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  return (
    <ProductsBrowser 
      title={search ? `Search Results for "${search}"` : "All Products"} 
      subtitle={search ? "Showing search results" : "Showing products"}
      searchQuery={search}
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
