"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Users", href: "/users", icon: Users },
  ];

  const isLinkActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen hidden md:flex flex-col">
      <div className="p-6 border-b border-border flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Admin<span className="text-brand">Pro</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isLinkActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-brand/10 text-brand font-semibold" 
                  : "text-card-foreground hover:bg-white/5 hover:text-white font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive 
                  ? "text-brand" 
                  : "text-gray-400 group-hover:text-brand"
              }`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        {(() => {
          const isActive = isLinkActive("/settings");
          return (
            <Link
              href="/settings"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-brand/10 text-brand font-semibold" 
                  : "text-card-foreground hover:bg-white/5 hover:text-white font-medium"
              }`}
            >
              <Settings className={`w-5 h-5 transition-colors ${
                isActive 
                  ? "text-brand" 
                  : "text-gray-400 group-hover:text-white"
              }`} />
              <span>Settings</span>
            </Link>
          );
        })()}
      </div>
    </aside>
  );
}
