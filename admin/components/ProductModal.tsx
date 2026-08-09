import React, { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  categories: any[];
  brands: any[];
  onSave: () => void;
}

type TabType =
  | "basic"
  | "pricing"
  | "attributes"
  | "variants"
  | "media"
  | "metrics";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  brands,
  onSave,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  const [formData, setFormData] = useState({
    name: "",
    customId: "",
    slug: "",
    model: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    compareAtPrice: 0,
    currency: "INR",
    stock: 0,
    sku: "",
    shippingCharge: 0,
    warranty: "",
    status: "active",
    images: [] as string[],
    thumbnail: "",
    rating: 0,
    reviewCount: 0,
    sold: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    features: [] as string[],
    tags: [] as string[],
    variants: [] as any[],
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      // Transform map/object to array for specs
      let parsedSpecs: { key: string; value: string }[] = [];
      if (
        product.specifications &&
        typeof product.specifications === "object"
      ) {
        parsedSpecs = Object.entries(product.specifications).map(
          ([key, value]) => ({
            key,
            value: String(value),
          }),
        );
      }

      setFormData({
        name: product.name || "",
        customId: product.customId || "",
        slug: product.slug || "",
        model: product.model || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        brand: product.brand?._id || product.brand || "",
        price: product.price || 0,
        compareAtPrice: product.compareAtPrice || 0,
        currency: product.currency || "USD",
        stock: product.stock || 0,
        sku: product.sku || "",
        shippingCharge: product.shippingCharge || 0,
        warranty: product.warranty || "",
        status: product.status || "active",
        images: Array.isArray(product.images)
          ? product.images.map((img: any) =>
              typeof img === "string" ? img : img.url,
            )
          : [],
        thumbnail: product.thumbnail || "",
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        sold: product.sold || 0,
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        features: Array.isArray(product.features) ? product.features : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        variants: Array.isArray(product.variants) ? product.variants : [],
      });
      setSpecs(parsedSpecs);
    } else {
      setFormData({
        name: "",
        customId: "",
        slug: "",
        model: "",
        description: "",
        category: "",
        brand: "",
        price: 0,
        compareAtPrice: 0,
        currency: "INR",
        stock: 0,
        sku: "",
        shippingCharge: 0,
        warranty: "",
        status: "active",
        images: [],
        thumbnail: "",
        rating: 0,
        reviewCount: 0,
        sold: 0,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: false,
        features: [],
        tags: [],
        variants: [],
      });
      setSpecs([]);
    }
    setActiveTab("basic");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleArrayChange = (
    field: "features" | "tags",
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayItem = (field: "features" | "tags") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveArrayItem = (field: "features" | "tags", index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleVariantChange = (index: number, field: string, val: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: val };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          storage: "",
          ram: "",
          sku: "",
          stock: 0,
          price: 0,
          images: [],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      const res = await api.post("/upload/multiple", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.images) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.images],
        }));
      }
    } catch (err: any) {
      console.error("Image upload failed", err);
      setError(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingThumbnail(true);
    const uploadData = new FormData();
    uploadData.append("image", e.target.files[0]);

    try {
      const res = await api.post("/upload/image", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.image) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: res.data.image,
        }));
      }
    } catch (err: any) {
      console.error("Thumbnail upload failed", err);
      setError(err.response?.data?.message || "Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
      e.target.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Transform specs array back to object map
    const specsObject: Record<string, string> = {};
    specs.forEach((spec) => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload = {
      ...formData,
      specifications: specsObject,
    };

    try {
      if (product) {
        await api.patch(`/admin/products/${product._id}`, payload);
      } else {
        await api.post("/admin/products", payload);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getImgSrc = (img: string) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img.replace(/^\/\.\./, "")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-card z-10 border-b border-border p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6 shrink-0 overflow-x-auto">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "pricing", label: "Pricing & Stock" },
            { id: "attributes", label: "Attributes" },
            { id: "variants", label: "Variants" },
            { id: "media", label: "Media" },
            { id: "metrics", label: "Metrics & Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Custom ID (SKU) *
                  </label>
                  <input
                    type="text"
                    name="customId"
                    value={formData.customId}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Compare at Price
                  </label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Shipping Charge
                  </label>
                  <input
                    type="number"
                    name="shippingCharge"
                    value={formData.shippingCharge}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Warranty Info
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
              </div>
            )}

            {activeTab === "attributes" && (
              <div className="space-y-8">
                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem("features")}
                      className="text-brand hover:text-brand-hover text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleArrayChange("features", i, e.target.value)
                          }
                          className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-white"
                          placeholder="e.g. 5G Enabled"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem("features", i)}
                          className="text-red-500 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {formData.features.length === 0 && (
                      <p className="text-xs text-gray-500">
                        No features added.
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Tags
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem("tags")}
                      className="text-brand hover:text-brand-hover text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Tag
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.tags.map((tag, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) =>
                            handleArrayChange("tags", i, e.target.value)
                          }
                          className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-white"
                          placeholder="e.g. smartphone"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem("tags", i)}
                          className="text-red-500 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {formData.tags.length === 0 && (
                      <p className="text-xs text-gray-500">No tags added.</p>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Specifications
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="text-brand hover:text-brand-hover text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Specification
                    </button>
                  </div>
                  <div className="space-y-2">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecChange(i, "key", e.target.value)
                          }
                          className="w-1/3 bg-background border border-border rounded-lg py-2 px-3 text-white"
                          placeholder="Key (e.g. Weight)"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(i, "value", e.target.value)
                          }
                          className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-white"
                          placeholder="Value (e.g. 200g)"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(i)}
                          className="text-red-500 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {specs.length === 0 && (
                      <p className="text-xs text-gray-500">
                        No specifications added.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "variants" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-400">
                    Product Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-brand hover:text-brand-hover text-sm flex items-center bg-brand/10 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Variant
                  </button>
                </div>
                {formData.variants.map((variant, i) => (
                  <div
                    key={i}
                    className="bg-background border border-border rounded-lg p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          value={variant.color || ""}
                          onChange={(e) =>
                            handleVariantChange(i, "color", e.target.value)
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Storage
                        </label>
                        <input
                          type="text"
                          value={variant.storage || ""}
                          onChange={(e) =>
                            handleVariantChange(i, "storage", e.target.value)
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          RAM
                        </label>
                        <input
                          type="text"
                          value={variant.ram || ""}
                          onChange={(e) =>
                            handleVariantChange(i, "ram", e.target.value)
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku || ""}
                          onChange={(e) =>
                            handleVariantChange(i, "sku", e.target.value)
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          value={variant.price || 0}
                          onChange={(e) =>
                            handleVariantChange(
                              i,
                              "price",
                              Number(e.target.value),
                            )
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock || 0}
                          onChange={(e) =>
                            handleVariantChange(
                              i,
                              "stock",
                              Number(e.target.value),
                            )
                          }
                          className="w-full bg-card border border-border rounded py-1 px-2 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formData.variants.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-border rounded-lg">
                    No variants added.
                  </p>
                )}
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">
                    Product Thumbnail
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {formData.thumbnail ? (
                      <div className="relative group w-24 h-24 rounded-lg border border-border overflow-hidden bg-background">
                        <img
                          src={getImgSrc(formData.thumbnail)}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveThumbnail}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-brand transition-colors bg-background flex flex-col items-center justify-center cursor-pointer">
                        {uploadingThumbnail ? (
                          <Loader2 className="w-6 h-6 animate-spin text-brand" />
                        ) : (
                          <>
                            <span className="text-2xl text-gray-500">+</span>
                            <span className="text-xs text-gray-500 mt-1">
                              Upload
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          disabled={uploadingThumbnail}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative group w-24 h-24 rounded-lg border border-border overflow-hidden bg-background"
                      >
                        <img
                          src={getImgSrc(img)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-brand transition-colors bg-background flex flex-col items-center justify-center cursor-pointer">
                      {uploadingImage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-brand" />
                      ) : (
                        <>
                          <span className="text-2xl text-gray-500">+</span>
                          <span className="text-xs text-gray-500 mt-1">
                            Upload
                          </span>
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
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Review Count
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Sold Count
                  </label>
                  <input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-gray-300">
                    Visibility Flags
                  </h3>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-border bg-background text-brand focus:ring-brand focus:ring-offset-background"
                    />
                    <span className="text-gray-400 text-sm">Is Featured</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-border bg-background text-brand focus:ring-brand focus:ring-offset-background"
                    />
                    <span className="text-gray-400 text-sm">
                      Is Best Seller
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-border bg-background text-brand focus:ring-brand focus:ring-offset-background"
                    />
                    <span className="text-gray-400 text-sm">
                      Is New Arrival
                    </span>
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="bg-card p-6 border-t border-border flex justify-end space-x-3 shrink-0">
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
            form="productForm"
            disabled={loading}
            className="bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>{product ? "Save Changes" : "Create Product"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
