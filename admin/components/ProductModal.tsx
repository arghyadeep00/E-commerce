import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  categories: any[];
  brands: any[];
  onSave: () => void;
}

export default function ProductModal({ isOpen, onClose, product, categories, brands, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    customId: '',
    slug: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    status: 'active',
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        customId: product.customId || '',
        slug: product.slug || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category?._id || product.category || '',
        brand: product.brand?._id || product.brand || '',
        status: product.status || 'active',
        images: Array.isArray(product.images) 
          ? product.images.map((img: any) => typeof img === 'string' ? img : img.url)
          : []
      });
    } else {
      setFormData({
        name: '',
        customId: '',
        slug: '',
        price: 0,
        stock: 0,
        category: '',
        brand: '',
        status: 'active',
        images: []
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    const uploadData = new FormData();
    Array.from(e.target.files).forEach(file => {
      uploadData.append('images', file);
    });

    try {
      // Create a temporary axios instance or use api with multipart/form-data
      const res = await api.post('/upload/multiple', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data && res.data.images) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...res.data.images]
        }));
      }
    } catch (err: any) {
      console.error('Image upload failed', err);
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product) {
        await api.patch(`/admin/products/${product._id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card z-10 border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Custom ID (SKU)</label>
              <input
                type="text"
                name="customId"
                value={formData.customId}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              >
                <option value="">Select a brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 text-white"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400">Product Images</label>
            <div className="flex flex-wrap gap-4">
              {formData.images.map((img, index) => {
                const imgSrc = img.startsWith('http') ? img : `http://localhost:5000${img.replace(/^\/\.\./, '')}`;
                return (
                  <div key={index} className="relative group w-24 h-24 rounded-lg border border-border overflow-hidden bg-background">
                    <img src={imgSrc} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-brand transition-colors bg-background flex flex-col items-center justify-center cursor-pointer">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                ) : (
                  <>
                    <span className="text-2xl text-gray-500">+</span>
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{product ? 'Save Changes' : 'Create Product'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
