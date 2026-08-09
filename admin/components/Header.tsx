import { Bell, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand transition-colors" />
          <input
            type="text"
            placeholder="Search products, orders, users..."
            className="w-full bg-card border border-border rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all text-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6 ml-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-border">
          <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@ecommerce.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
