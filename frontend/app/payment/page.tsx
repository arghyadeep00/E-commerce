"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { savePaymentMethod } from "@/lib/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shippingAddress, paymentMethod: currentPaymentMethod } = useAppSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod || "PayPal");

  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping");
    }
  }, [shippingAddress, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    router.push("/placeorder");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Payment Method</CardTitle>
          <CardDescription>
            Select how you want to pay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Custom Radio Button Style for Payment Methods */}
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'PayPal' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                onClick={() => setPaymentMethod('PayPal')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'PayPal' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {paymentMethod === 'PayPal' && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  <Label className="cursor-pointer font-medium text-lg">PayPal / Credit Card</Label>
                </div>
                {paymentMethod === 'PayPal' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>

              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Stripe' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                onClick={() => setPaymentMethod('Stripe')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Stripe' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {paymentMethod === 'Stripe' && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  <Label className="cursor-pointer font-medium text-lg">Stripe</Label>
                </div>
                {paymentMethod === 'Stripe' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
