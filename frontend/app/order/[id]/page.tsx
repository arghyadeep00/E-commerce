"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-8 text-center mt-12">
        <div className="inline-flex bg-destructive/10 p-4 rounded-full mb-4">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push("/orders")}>
          Back to My Orders
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Order Details
          </h1>
          <p className="text-muted-foreground mt-1">
            Order #{order.orderNumber}
          </p>
        </div>
        <Button variant="outline">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(order.orderStatus)}
                Order Status: <span className="capitalize">{order.orderStatus}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Shipping Information</h3>
                  <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                  <p className="text-sm mt-1">{order.user?.email}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Address ID: {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Payment Details</h3>
                  <p className="font-medium flex items-center gap-2">
                    Method: {order.paymentMethod}
                  </p>
                  <p className="text-sm mt-1 capitalize flex items-center gap-1">
                    Status: {order.paymentStatus}
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.products?.map((item: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="bg-muted/20 p-2 rounded">
                    {item.product?.images?.[0] ? (
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name || 'Product'} 
                        width={80} 
                        height={80} 
                        className="w-20 h-20 object-contain rounded"
                      />
                    ) : (
                      <Package className="w-20 h-20 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.product?._id}`} className="font-semibold text-lg hover:underline">
                      {item.product?.name || 'Unknown Product'}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      Qty: {item.quantity} | Price: ₹{item.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="font-bold text-lg mt-2 sm:mt-0">
                    ₹{(item.quantity * item.price)?.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 pb-4 border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">₹{order.shippingCharge?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">-₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-extrabold text-primary">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
