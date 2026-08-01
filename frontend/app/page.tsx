'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Discover Premium Products</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Shop the latest trends with our curated collection of high-quality items designed just for you.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2">Check back later for new arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
              <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-blue-600">${product.price.toFixed(2)}</span>
                  <button className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-full transition-colors">
                    <ShoppingBag className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
