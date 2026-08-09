"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import ProductModal from "@/components/ProductModal";

interface ProductsClientProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
}

export default function ProductsClient({ initialProducts, categories, brands }: ProductsClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    let categoryMatch = true;
    let stockMatch = true;

    if (categoryFilter !== "all") {
      const catId = product.category?._id || product.category;
      categoryMatch = catId === categoryFilter;
    }

    if (stockFilter !== "all") {
      if (stockFilter === "in_stock") stockMatch = product.stock > 0;
      if (stockFilter === "out_of_stock") stockMatch = product.stock === 0;
    }

    return categoryMatch && stockMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Products
          </h2>
          <p className="text-gray-400 mt-1">
            Manage your store's inventory and pricing.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchProducts}
            className="bg-card hover:bg-white/5 border border-border text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={openAddModal}
            className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Filter by Category</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Filter by Stock</label>
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/50"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden min-h-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-card/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images[0] ? (
                        <img
                          src={
                            (product.images[0].url || product.images[0]).startsWith('http')
                              ? (product.images[0].url || product.images[0])
                              : `http://localhost:5000${(product.images[0].url || product.images[0]).replace(/^\/\.\./, '')}`
                          }
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {product.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        product.stock > 0
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="text-gray-400 hover:text-brand transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No products found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        categories={categories}
        brands={brands}
        onSave={fetchProducts} 
      />
    </div>
  );
}

