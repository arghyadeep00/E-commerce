import React from 'react'

import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { name: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign, trend: "up" },
    { name: "Orders", value: "+2350", change: "+180.1%", icon: ShoppingBag, trend: "up" },
    { name: "Active Users", value: "+12,234", change: "+19%", icon: Users, trend: "up" },
    { name: "Conversion Rate", value: "3.24%", change: "+1.2%", icon: TrendingUp, trend: "up" },
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
                <p className="text-xs text-brand mt-1">{stat.change} from last month</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Additional sections can go here, like recent orders table or charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="bg-card rounded-xl border border-border md:col-span-4 min-h-100 p-6 flex flex-col justify-center items-center">
          <p className="text-gray-500">Sales Chart Placeholder</p>
        </div>
        <div className="bg-card rounded-xl border border-border md:col-span-3 min-h-100 p-6 flex flex-col justify-center items-center">
          <p className="text-gray-500">Recent Sales Placeholder</p>
        </div>
      </div>
    </div>
  );
}
