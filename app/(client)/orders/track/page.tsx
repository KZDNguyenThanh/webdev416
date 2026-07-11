"use client";

import { lookupGuestOrder } from "@/actions/orders";
import Container from "@/components/Container";
import OrderDetailDialog from "@/components/OrderDetailDialog";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrderDTO } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

const TrackOrderContent = () => {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("orderNumber") ?? "",
  );
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !contact.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng và email/số điện thoại.");
      return;
    }
    setLoading(true);
    try {
      const found = await lookupGuestOrder(orderNumber, contact);
      if (!found) {
        toast.error(
          "Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và email/số điện thoại.",
        );
        setOrder(null);
        return;
      }
      setOrder(found);
      setDialogOpen(true);
    } catch (error) {
      console.error("Order lookup error:", error);
      toast.error("Không thể tra cứu đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg">
      <PageHero
        eyebrow="Tra cứu"
        title="Tra cứu đơn hàng"
        subtitle="Nhập mã đơn và email/số điện thoại đã dùng khi đặt hàng để xem trạng thái."
      />
      <Container className="py-10">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Nhập thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="order-number">Mã đơn hàng</Label>
                <Input
                  id="order-number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="VD: KN260627AB12"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="order-contact">
                  Email hoặc số điện thoại
                  <span className="ml-1 text-xs font-normal text-lightText">
                    (đã dùng khi đặt hàng)
                  </span>
                </Label>
                <Input
                  id="order-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="email@example.com hoặc 0901234567"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full font-semibold tracking-wide hoverEffect"
              >
                {loading ? "Đang tra cứu…" : "Tra cứu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      <OrderDetailDialog
        order={order}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

const TrackOrderPage = () => (
  <Suspense fallback={<div className="py-10 text-center">Đang tải…</div>}>
    <TrackOrderContent />
  </Suspense>
);

export default TrackOrderPage;
