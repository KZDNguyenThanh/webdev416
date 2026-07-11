import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from "@/app/(admin)/admin/actions";
import PriceFormatter from "@/components/PriceFormatter";

function paymentStatusClass(status: string) {
  if (status === "PAID") return "bg-emerald-100 text-emerald-700";
  if (status === "REFUNDED") return "bg-slate-200 text-slate-700";
  if (status === "CANCELLED") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function orderStatusClass(status: string) {
  if (status === "DELIVERED") return "bg-emerald-100 text-emerald-700";
  if (status === "CANCELLED") return "bg-rose-100 text-rose-700";
  if (status === "OUT_FOR_DELIVERY") return "bg-indigo-100 text-indigo-700";
  return "bg-zinc-100 text-zinc-700";
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { orderedAt: "desc" },
    take: 50,
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-lightColor mt-1">
          Track order and payment lifecycle from one place.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => {
            const isCod = order.paymentProvider === "COD";
            // COD cho phép đổi trạng thái đơn trước khi PAID; còn lại vẫn khóa
            // tới khi thanh toán xong.
            const canEditStatus = order.paymentStatus === "PAID" || isCod;
            return (
            <div
              key={order.id}
              className="rounded-lg border border-darkBlue/10 p-4 space-y-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Order Code
                  </p>
                  <p className="font-semibold text-base">
                    #{order.orderNumber}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${
                      isCod
                        ? "bg-orange-100 text-orange-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {isCod ? "COD" : "Chuyển khoản"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${paymentStatusClass(order.paymentStatus)}`}
                  >
                    PS: {order.paymentStatus}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${orderStatusClass(order.status)}`}
                  >
                    OS: {canEditStatus ? order.status : "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Customer
                  </p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-lightColor">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Total
                  </p>
                  <PriceFormatter amount={Number(order.totalAmount)} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Items
                  </p>
                  <p className="font-medium">{order.items.length} item(s)</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Ordered At
                  </p>
                  <p className="text-lightColor">
                    {new Date(order.orderedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <form
                  action={updateOrderStatusAction}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="status"
                    defaultValue={canEditStatus ? order.status : ""}
                    disabled={!canEditStatus}
                    className="h-9 border rounded-md px-2 text-sm"
                  >
                    <option value="">Select Order Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <Button type="submit" variant="outline" disabled={!canEditStatus}>
                    Save Order Status
                  </Button>
                </form>

                <form
                  action={updatePaymentStatusAction}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="paymentStatus"
                    defaultValue={order.paymentStatus}
                    className="h-9 border rounded-md px-2 text-sm"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="REFUNDED">REFUNDED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <Button type="submit" variant="outline">
                    Save Payment Status
                  </Button>
                </form>
              </div>

              <details className="rounded-md border border-darkBlue/10 bg-zinc-50/50">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-darkBlue hover:bg-zinc-100/80">
                  #{order.orderNumber} - Click to view order details
                </summary>
                <div className="overflow-x-auto px-3 pb-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-lightColor">
                        <th className="py-2">Product</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Unit Price</th>
                        <th className="py-2">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-2">{item.productName}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">
                            <PriceFormatter amount={Number(item.unitPrice)} />
                          </td>
                          <td className="py-2">
                            <PriceFormatter amount={Number(item.lineTotal)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
