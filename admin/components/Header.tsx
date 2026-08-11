"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/admin-auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("adminInfo");
    router.push("/login");
  };

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

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-border"
          >
            <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-white flex items-center gap-1">
                Admin User <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </p>
              <p className="text-xs text-gray-400">admin@ecommerce.com</p>
            </div>
          </div>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 mb-1 bg-black/20">
                <p className="text-sm text-white font-medium">My Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage your account</p>
              </div>
              <button 
                onClick={() => { setDropdownOpen(false); /* route to profile if exists */ }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-brand" /> View Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
