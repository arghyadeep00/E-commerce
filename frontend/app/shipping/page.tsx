"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { saveShippingAddress } from "@/lib/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { MapPin, CheckCircle2, Plus } from "lucide-react";

export default function ShippingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shippingAddress } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { addresses, isLoading } = useAppSelector((state) => state.address);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=shipping");
    }
  }, [isAuthenticated, router]);

  // Pre-select default address if user hasn't chosen one
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      } else {
        setSelectedAddressId(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddressId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;
    
    const selected = addresses.find(a => a._id === selectedAddressId);
    if (selected) {
      // Map to old shipping format expected by checkout
      dispatch(saveShippingAddress({
        address: `${selected.addressLine1} ${selected.addressLine2 || ''}`.trim(),
        city: selected.city,
        postalCode: selected.zipCode,
        country: selected.country,
      }));
      router.push("/payment");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg border-muted">
        <CardHeader className="space-y-1 text-center border-b pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Select Shipping Address</CardTitle>
          <CardDescription>
            Choose where you want us to deliver your order
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No addresses found</h3>
              <p className="text-muted-foreground mb-6">You need to add a shipping address before proceeding.</p>
              <Button asChild>
                <Link href="/address">Add New Address</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-primary">
                          <CheckCircle2 className="h-5 w-5 fill-primary/20" />
                        </div>
                      )}
                      <h4 className="font-bold mb-1 pr-6">{addr.fullName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{addr.phone}</p>
                      <p className="text-sm leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                        <br />
                        {addr.city}, {addr.state} {addr.zipCode}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
                <Button variant="outline" type="button" asChild className="w-full sm:w-auto">
                  <Link href="/address"><Plus className="h-4 w-4 mr-2" /> Add a new address</Link>
                </Button>
                
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!selectedAddressId}>
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
