import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/lib/data/queries";
import { getCurrentUser } from "@/lib/auth/server";
import { FileX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const OrdersPage = async () => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return redirect("/");
  }

  const orders = await getMyOrders(user.id);

  return (
    <div>
      <PageHero
        eyebrow="Tài khoản"
        title="Đơn hàng của tôi"
        subtitle="Theo dõi trạng thái và lịch sử các đơn hàng của bạn."
      />
      <Container className="py-10">
        {orders?.length ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ngày đặt
                      </TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Tổng cộng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Số hóa đơn
                      </TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-brand-muted mb-4" />
            <h2 className="display-title text-2xl text-brand-dark">
              Chưa có đơn hàng nào
            </h2>
            <p className="mt-2 text-sm text-lightText text-center max-w-md">
              Có vẻ bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm để xem đơn
              hàng của bạn ở đây!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Khám phá sản phẩm</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
