"use client";

import { useState, useEffect, Fragment } from "react";
import { Eye, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/admin/orders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "processing":
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "shipped":
        return "bg-brand/10 text-brand border-brand/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Orders</h2>
          <p className="text-gray-400 mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden min-h-100">
        {loading ? (
          <div className="flex items-center justify-center h-full pt-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-card/50 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Order ID</th>
                  <th scope="col" className="px-6 py-4 font-medium">Customer</th>
                  <th scope="col" className="px-6 py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 py-4 font-medium">Total</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  const customerName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email : 'Guest';
                  const status = order.status || order.orderStatus || "processing";
                  
                  return (
                    <Fragment key={order._id}>
                      <tr className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-medium text-white">{order.orderNumber || order._id.substring(0, 10) + '...'}</td>
                        <td className="px-6 py-4 text-gray-300">{customerName}</td>
                        <td className="px-6 py-4 text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-gray-300">₹{order.total?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(status.toLowerCase())}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => toggleExpand(order._id)}
                            className="text-gray-400 hover:text-brand transition-colors flex items-center justify-end w-full gap-2"
                          >
                            <span className="text-xs">Details</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/20">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
                              <div>
                                <h4 className="text-white font-semibold mb-3 border-b border-border pb-2">Order Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-gray-500 inline-block w-32">Order ID:</span> {order._id}</p>
                                  <p><span className="text-gray-500 inline-block w-32">Payment Method:</span> {order.paymentMethod || 'N/A'}</p>
                                  <p><span className="text-gray-500 inline-block w-32">Payment Status:</span> <span className="capitalize">{order.paymentStatus || 'pending'}</span></p>
                                  <p><span className="text-gray-500 inline-block w-32">Shipping Charge:</span> ₹{order.shippingCharge?.toFixed(2) || '0.00'}</p>
                                  <p><span className="text-gray-500 inline-block w-32">Tax:</span> ₹{order.tax?.toFixed(2) || '0.00'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-white font-semibold mb-3 border-b border-border pb-2">Products</h4>
                                <div className="space-y-3">
                                  {order.products && order.products.length > 0 ? (
                                    order.products.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-center text-sm bg-black/40 p-2 rounded">
                                        <div className="flex flex-col">
                                          <span className="text-white">{item.product?.name || 'Unknown Product'}</span>
                                          <span className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</span>
                                        </div>
                                        <span className="font-medium text-brand">₹{(item.quantity * item.price)?.toFixed(2)}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-500">No products found for this order.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
