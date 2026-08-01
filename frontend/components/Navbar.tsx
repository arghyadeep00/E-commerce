'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-blue-600 tracking-tight">ShopHub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-500 hover:text-gray-900 transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {(user.role === 'admin' || user.role === 'seller') && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
