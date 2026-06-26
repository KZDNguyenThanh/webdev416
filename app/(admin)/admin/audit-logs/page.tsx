import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm text-lightColor mt-1">
          Track admin changes for products, users, orders, pages, and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border rounded-md p-3 text-sm space-y-1"
            >
              <p className="font-semibold">{log.action}</p>
              <p className="text-lightColor">
                {log.entityType}
                {log.entityId ? ` · ${log.entityId}` : ""}
              </p>
              <p>By: {log.actor?.fullName || log.actor?.email || "Unknown"}</p>
              <p className="text-lightColor">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
