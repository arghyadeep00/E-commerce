"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import api from "@/lib/api";
import { clearCartAsync } from "@/lib/features/cart/cartSlice";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

export default function PlaceOrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate prices
  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      router.push("/shipping");
    } else if (!cart.paymentMethod) {
      router.push("/payment");
    }
  }, [cart.shippingAddress, cart.paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/orders", {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      if (cart.paymentMethod === 'Razorpay') {
        // Create intent
        const { data: intentData } = await api.post("/payment/create-intent", { orderId: data._id });

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TNiJNixeLIOX25',
          amount: intentData.amount,
          currency: intentData.currency,
          name: "E-commerce App",
          description: "Order Payment",
          order_id: intentData.id,
          handler: async function (response: any) {
            try {
              await api.post("/payment/verify", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data._id,
              });
              dispatch(clearCartAsync());
              router.push(`/order/${data._id}`);
            } catch (err: any) {
              setError("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
          setError(response.error.description);
          setLoading(false);
        });
        rzp1.open();
      } else {
        dispatch(clearCartAsync());
        router.push(`/order/${data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
      setLoading(false);
    }
  };

  if (cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products" className={buttonVariants()}>
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Place Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 object-contain rounded bg-muted/20" />
                  <div className="flex-1">
                    <Link href={`/product/${item._id}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                  </div>
                  <div className="font-medium text-muted-foreground">
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardHeader className="bg-primary/5 pb-4 border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span className="font-medium">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-extrabold">${totalPrice.toFixed(2)}</span>
              </div>
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-4">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-primary/5 border-t pt-6">
              <Button 
                className="w-full text-lg h-12 gap-2" 
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0 || loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
