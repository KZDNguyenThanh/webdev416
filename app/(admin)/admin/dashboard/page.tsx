import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import PriceFormatter from "@/components/PriceFormatter";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [
    productCount,
    orderCount,
    userCount,
    pageCount,
    pendingOrders,
    revenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.page.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
  ]);

  const stats = [
    { label: "Sản phẩm", value: productCount },
    { label: "Đơn hàng", value: orderCount },
    { label: "Người dùng", value: userCount },
    { label: "Trang nội dung", value: pageCount },
    { label: "Đơn chờ xử lý", value: pendingOrders },
    { label: "Doanh thu", value: Number(revenue._sum.totalAmount || 0) },
  ];

  const latestOrders = await prisma.order.findMany({
    orderBy: { orderedAt: "desc" },
    take: 6,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      totalAmount: true,
      status: true,
      paymentStatus: true,
      orderedAt: true,
    },
  });

  const statusClassMap: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-700",
    PAID: "bg-emerald-100 text-emerald-700",
    REFUNDED: "bg-zinc-200 text-zinc-700",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-darkColor">
              Bảng điều khiển
            </h1>
            <p className="mt-1 text-sm text-lightColor">
              Tổng quan nhanh về sản phẩm, đơn hàng và doanh thu.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders"
              className="rounded-md border border-darkBlue/20 px-3 py-2 text-sm font-medium text-darkBlue hover:bg-darkBlue/5"
            >
              Quản lý đơn hàng
            </Link>
            <Link
              href="/admin/products"
              className="rounded-md border border-darkBlue/20 px-3 py-2 text-sm font-medium text-darkBlue hover:bg-darkBlue/5"
            >
              Quản lý sản phẩm
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => (
          <Card key={item.label} className="gap-2">
            <CardHeader className="pb-0">
              <CardDescription className="text-xs uppercase tracking-wide">
                {item.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {item.label === "Doanh thu" ? (
                <PriceFormatter
                  amount={Number(item.value)}
                  className="text-2xl"
                />
              ) : (
                <p className="text-2xl font-bold text-darkColor">
                  {item.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>
            6 đơn hàng mới nhất và trạng thái hiện tại.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {latestOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-darkBlue/10 p-3 text-sm"
            >
              <div className="grid grid-cols-1 gap-2 md:grid-cols-6 md:items-center">
                <div className="md:col-span-2">
                  <p className="font-semibold text-darkColor">
                    #{order.orderNumber}
                  </p>
                  <p className="text-lightColor line-clamp-1">
                    {order.customerName}
                  </p>
                  <p className="text-lightColor line-clamp-1">
                    {order.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Số tiền
                  </p>
                  <PriceFormatter amount={Number(order.totalAmount)} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Đơn
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[order.status] || "bg-zinc-100 text-zinc-700"}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-lightColor">
                    Thanh toán
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[order.paymentStatus] || "bg-zinc-100 text-zinc-700"}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="text-lightColor md:text-right">
                  {new Date(order.orderedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {latestOrders.length === 0 ? (
            <p className="text-sm text-lightColor">Chưa có đơn hàng nào.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
