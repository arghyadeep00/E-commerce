"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, LogOut, Package, MapPin } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Basic client-side protection
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // The useEffect will redirect to /login
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg line-clamp-1">{user.name}</CardTitle>
                  <CardDescription className="line-clamp-1">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/profile" className="w-full">
                <Button variant={pathname === "/profile" ? "secondary" : "ghost"} className="justify-start w-full">
                  <User className="mr-2 h-4 w-4" /> Account Details
                </Button>
              </Link>
              <Link href="/orders" className="w-full">
                <Button variant={pathname === "/orders" ? "secondary" : "ghost"} className="justify-start w-full">
                  <Package className="mr-2 h-4 w-4" /> My Orders
                </Button>
              </Link>
              <Link href="/address" className="w-full">
                <Button variant={pathname === "/address" ? "secondary" : "ghost"} className="justify-start w-full">
                  <MapPin className="mr-2 h-4 w-4" /> Addresses
                </Button>
              </Link>
              <div className="border-t my-2"></div>
              <Button variant="ghost" className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area (Rendered child pages) */}
        <div className="w-full md:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
}
