import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  toggleUserActiveAction,
  updateUserRoleAction,
} from "@/app/(admin)/admin/actions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-lightColor mt-1">
          Manage active state and admin access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-3 grid grid-cols-1 md:grid-cols-7 gap-2 items-center"
            >
              <p className="text-sm md:col-span-2">
                {item.fullName || "No Name"}{" "}
                <span className="text-lightColor">({item.email})</span>
              </p>
              <form
                action={updateUserRoleAction}
                className="flex items-center gap-2 md:col-span-2"
              >
                <input type="hidden" name="id" value={item.id} />
                <select
                  name="role"
                  defaultValue={item.role}
                  className="h-9 border rounded-md px-2 text-sm"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <Button type="submit" variant="outline">
                  Save Role
                </Button>
              </form>
              <form action={toggleUserActiveAction} className="md:col-span-2">
                <input type="hidden" name="id" value={item.id} />
                <input
                  type="hidden"
                  name="isActive"
                  value={item.isActive ? "false" : "true"}
                />
                <Button
                  type="submit"
                  variant={item.isActive ? "destructive" : "default"}
                >
                  {item.isActive ? "Disable" : "Enable"}
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
