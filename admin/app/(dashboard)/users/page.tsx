"use client"
"use client";

import { useEffect, useState } from "react";
import { UserCog, Trash2, Mail, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        // Merge users and admins, mapping their fields for the table
        const mappedUsers = data.users.map((u: any) => ({ ...u, displayRole: "Customer" }));
        const mappedAdmins = data.admins.map((a: any) => ({ ...a, displayRole: a.role === "admin" ? "Admin" : "SubAdmin" }));
        setUsers([...mappedAdmins, ...mappedUsers]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

      <div className="bg-card rounded-xl border border-border overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full pt-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : (
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
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xs uppercase">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.displayRole === "Admin"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : user.displayRole === "SubAdmin"
                            ? "bg-brand/10 text-brand border-brand/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {user.displayRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
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
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td>
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
