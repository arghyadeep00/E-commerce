"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden rounded-xl cursor-pointer border-none bg-muted/50 hover:bg-muted transition-colors">
        <CardContent className="p-0">
          <div className="aspect-4/3 bg-gray-200 relative overflow-hidden flex items-center justify-center">
            {/* Placeholder for Next.js Image */}
            <span className="text-muted-foreground font-medium">
              {category.name}
            </span>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
