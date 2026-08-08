"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/lib/features/address/addressSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MapPinOff, Plus, Trash2, Edit2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressPage() {
  const dispatch = useAppDispatch();
  const { addresses, isLoading } = useAppSelector((state) => state.address);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    isDefault: false,
  });

  const openForm = (address?: any) => {
    if (address) {
      setEditingId(address._id);
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        country: address.country,
        state: address.state,
        city: address.city,
        zipCode: address.zipCode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        landmark: address.landmark || "",
        isDefault: address.isDefault,
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        isDefault: addresses.length === 0,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(
        updateAddress({ id: editingId, addressData: formData }),
      ).unwrap();
    } else {
      await dispatch(createAddress(formData)).unwrap();
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultAddress(id));
  };

  if (isFormOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Address" : "Add New Address"}
          </CardTitle>
          <CardDescription>Enter your shipping details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>

              {!formData.isDefault && (
                <div className="flex items-center space-x-2 md:col-span-2 mt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault">
                    Set as default shipping address
                  </Label>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Address"}
              </Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-[60vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Addresses</CardTitle>
          <CardDescription>
            Manage your shipping and billing addresses
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="hidden sm:flex gap-2"
          onClick={() => openForm()}
        >
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        {addresses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="bg-muted/30 p-6 rounded-full mb-6">
              <MapPinOff
                className="h-16 w-16 text-muted-foreground/50"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              You haven't saved any addresses yet. Add an address now for a
              faster checkout experience later.
            </p>
            <Button size="lg" className="gap-2" onClick={() => openForm()}>
              <Plus className="h-4 w-4" /> Add New Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mobile Add Button */}
            <div className="sm:hidden mb-4">
              <Button className="w-full gap-2" onClick={() => openForm()}>
                <Plus className="h-4 w-4" /> Add Address
              </Button>
            </div>

            {addresses.map((addr) => (
              <Card
                key={addr._id}
                className={`relative border-2 ${addr.isDefault ? "border-primary" : "border-muted"} overflow-hidden`}
              >
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Default
                  </div>
                )}
                <CardContent className="p-5">
                  <h4 className="font-bold text-lg mb-1">{addr.fullName}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {addr.phone}
                  </p>
                  <p className="text-sm leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 && (
                      <>
                        <br />
                        {addr.addressLine2}
                      </> 
                    )}
                    <br />
                    {addr.city}, {addr.state} {addr.zipCode}
                    <br />
                    {addr.country}
                  </p>
                  {addr.landmark && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      Landmark: {addr.landmark}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(addr._id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(addr)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(addr._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
