"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateCartQtyAsync, removeFromCartAsync } from "@/lib/features/cart/cartSlice";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const checkoutHandler = () => {
    router.push("/login?redirect=shipping");
  };

  const updateQuantity = (item: any, qty: number) => {
    dispatch(updateCartQtyAsync({ productId: item._id, quantity: qty }));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromCartAsync(id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-contain rounded-md bg-muted/20"
                />
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <Link href={`/product/${item._id}`} className="font-semibold text-lg hover:underline line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-xl font-bold mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item, Math.max(1, item.qty - 1))}
                      >
                        -
                      </Button>
                      <span className="w-10 text-center font-medium">{item.qty}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item, Math.min(item.countInStock, item.qty + 1))}
                      >
                        +
                      </Button>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => removeItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-primary/20">
              <CardHeader className="bg-primary/5 pb-4 border-b">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Subtotal:</span>
                  <span className="text-2xl font-extrabold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 border-t pt-6">
                <Button 
                  className="w-full text-lg h-12 gap-2" 
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
