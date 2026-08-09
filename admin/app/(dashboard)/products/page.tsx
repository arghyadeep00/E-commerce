"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import api from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: "1", name: "Wireless Headphones", price: 129.99, stock: 45, status: "Active" },
    { id: "2", name: "Mechanical Keyboard", price: 149.99, stock: 12, status: "Active" },
    { id: "3", name: "Gaming Mouse", price: 79.99, stock: 0, status: "Out of Stock" },
  ]);

  // Example of how we will fetch real data later
  /*
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);
  */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Products</h2>
          <p className="text-gray-400 mt-1">Manage your store's inventory and pricing.</p>
        </div>
        <button className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-card/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Product Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Price</th>
                <th scope="col" className="px-6 py-4 font-medium">Stock</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 text-gray-300">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-300">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-brand transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
