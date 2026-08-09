"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from "lucide-react";
import api from '@/lib/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const stats = [
    { name: "Total Revenue", value: `$${data?.totalRevenue?.toFixed(2) || "0.00"}`, icon: DollarSign },
    { name: "Total Orders", value: data?.totalOrders || 0, icon: ShoppingBag },
    { name: "Total Users", value: data?.totalUsers || 0, icon: Users },
    { name: "Total Products", value: data?.totalProducts || 0, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-gray-400 mt-2">Welcome back! Here's an overview of your store.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <Icon className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="bg-card rounded-xl border border-border md:col-span-4 min-h-100 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Orders</h3>
          {data?.recentOrders?.length > 0 ? (
             <div className="space-y-4">
               {data.recentOrders.map((order: any) => (
                 <div key={order._id} className="flex justify-between items-center border-b border-border pb-2">
                   <div>
                     <p className="text-sm text-white font-medium">{order.user?.name || "Guest"}</p>
                     <p className="text-xs text-gray-400">{order._id}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-brand">${order.totalPrice?.toFixed(2)}</p>
                     <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent orders found.</p>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border md:col-span-3 min-h-100 p-6 flex flex-col justify-center items-center">
          <p className="text-gray-500">More widgets coming soon.</p>
        </div>
      </div>
    </div>
  );
}
