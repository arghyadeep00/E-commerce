"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    { id: "ORD-9281", customer: "Alice Johnson", date: "2023-10-25", total: 299.98, status: "Delivered" },
    { id: "ORD-9282", customer: "Bob Smith", date: "2023-10-26", total: 49.99, status: "Processing" },
    { id: "ORD-9283", customer: "Charlie Davis", date: "2023-10-27", total: 129.99, status: "Shipped" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Shipped":
        return "bg-brand/10 text-brand border-brand/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
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

      <div className="bg-card rounded-xl border border-border overflow-hidden">
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-300">{order.date}</td>
                  <td className="px-6 py-4 text-gray-300">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-brand transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
