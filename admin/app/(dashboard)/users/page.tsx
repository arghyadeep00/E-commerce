"use client"
import { useState } from "react";
import { UserCog, Trash2, Mail, Plus } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: "1", name: "Admin User", email: "admin@ecommerce.com", role: "Admin", joinDate: "2023-01-15" },
    { id: "2", name: "Alice Johnson", email: "alice@example.com", role: "Customer", joinDate: "2023-05-20" },
    { id: "3", name: "Bob Smith", email: "bob@example.com", role: "Customer", joinDate: "2023-08-11" },
  ]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Users & Admins</h2>
          <p className="text-gray-400 mt-1">Manage customers and admin staff.</p>
        </div>
        <Link 
          href="/users/create"
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Sub-Admin</span>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-card/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Email</th>
                <th scope="col" className="px-6 py-4 font-medium">Role</th>
                <th scope="col" className="px-6 py-4 font-medium">Join Date</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === "Admin"
                          ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          : user.role === "SubAdmin"
                          ? "bg-brand/10 text-brand border-brand/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.joinDate}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-brand transition-colors" title="Send Email">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-brand transition-colors" title="Edit Role">
                      <UserCog className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete User">
                      <Trash2 className="w-4 h-4" />
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
