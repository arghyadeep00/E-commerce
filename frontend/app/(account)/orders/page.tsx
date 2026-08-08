"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <Card className="min-h-[60vh] flex flex-col">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>View and track your recent orders</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <PackageX className="h-16 w-16 text-muted-foreground/50" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          You haven't placed any orders yet. When you do, their details and tracking information will appear here.
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
