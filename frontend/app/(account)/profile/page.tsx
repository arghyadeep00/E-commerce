"use client";

import { useAppSelector } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h4>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h4>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Account Role</h4>
              <p className="text-lg font-medium capitalize">{user.role || "Customer"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
