"use client";

import { getMyAddresses } from "@/actions/catalog";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import AddressSelector from "@/components/AddressSelector";
import Container from "@/components/Container";
import GuestCheckoutForm, {
  emptyGuestInfo,
  validateGuestInfo,
  type GuestErrors,
  type GuestInfo,
} from "@/components/GuestCheckoutForm";
import PaymentDialog from "@/components/PaymentDialog";
import PriceFormatter from "@/components/PriceFormatter";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getImageUrl } from "@/lib/image";
import type { AddressDTO } from "@/lib/types";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const router = useRouter();
  const { isSignedIn, user, loading: authLoading } = useAuthUser();
  const buyNowItem = useStore((state) => state.buyNowItem);
  const clearBuyNowItem = useStore((state) => state.clearBuyNowItem);

  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(
    null,
  );
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(emptyGuestInfo);
  const [guestErrors, setGuestErrors] = useState<GuestErrors>({});
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<{
    orderNumber: string;
    amount: number;
    redirectUrl: string;
  } | null>(null);

  useEffect(() => {
    // A hard refresh loses the in-memory buy-now item; send the user back to cart.
    if (!buyNowItem && !payment) {
      router.replace("/cart");
    }
  }, [buyNowItem, payment, router]);

  useEffect(() => {
    let active = true;
    getMyAddresses()
      .then((data) => {
        if (!active) return;
        setAddresses(data);
        const def = data.find((a) => a.default) ?? data[0] ?? null;
        setSelectedAddress(def);
      })
      .catch((err) => console.error("Addresses fetching error:", err));
    return () => {
      active = false;
    };
  }, []);

  const handleAddressCreated = (address: AddressDTO) => {
    setAddresses((prev) => [address, ...prev]);
    setSelectedAddress(address);
  };
  const handleAddressUpdated = (updated: AddressDTO) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === updated.id ? updated : updated.default ? { ...a, default: false } : a,
      ),
    );
    setSelectedAddress((cur) => (cur?.id === updated.id ? updated : cur));
  };
  const handleAddressDeleted = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      setSelectedAddress((cur) =>
        cur && cur.id !== id ? cur : next.find((a) => a.default) ?? next[0] ?? null,
      );
      return next;
    });
  };

  const product = buyNowItem?.product;
  const quantity = buyNowItem?.quantity ?? 1;
  const unitPrice = product?.price ?? 0;
  const totalPrice = unitPrice * quantity;
  const subTotalPrice =
    (unitPrice + ((product?.discount ?? 0) * unitPrice) / 100) * quantity;

  const handlePlaceOrder = async () => {
    if (!buyNowItem) return;

    let metadata: Metadata;
    if (isSignedIn) {
      if (!selectedAddress) {
        toast.error("Vui lòng chọn địa chỉ giao hàng.");
        return;
      }
      metadata = {
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.email ?? "Unknown",
        userId: user?.id,
        addressId: selectedAddress.id,
      };
    } else {
      const errors = validateGuestInfo(guestInfo);
      setGuestErrors(errors);
      if (Object.keys(errors).length > 0) {
        toast.error("Vui lòng kiểm tra lại thông tin giao hàng.");
        return;
      }
      metadata = {
        customerName: guestInfo.name.trim(),
        customerEmail: guestInfo.email.trim(),
        address: {
          id: "",
          name: guestInfo.name.trim(),
          phone: guestInfo.phone.trim(),
          email: guestInfo.email.trim() || null,
          address: guestInfo.address.trim(),
          city: guestInfo.city.trim(),
          state: null,
          zip: null,
          default: false,
        },
      };
    }

    setLoading(true);
    try {
      const result = await createCheckoutSession([buyNowItem], metadata);
      clearBuyNowItem();
      setPayment({
        orderNumber: result.orderNumber,
        amount: result.totalAmount,
        redirectUrl: result.redirectUrl,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Không thể đặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-10">
      <Container>
        <div className="flex items-center gap-2 py-5">
          <ShoppingBag className="text-darkColor" />
          <Title>Thanh toán</Title>
        </div>
        <div className="grid lg:grid-cols-3 md:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="border bg-white rounded-md p-4 flex items-center gap-4">
              {product.images && (
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              )}
              <div className="flex-1">
                <h2 className="font-semibold line-clamp-1">{product.name}</h2>
                <p className="text-sm text-black/60">Số lượng: {quantity}</p>
              </div>
              <PriceFormatter amount={totalPrice} className="font-bold" />
            </div>
            {authLoading ? null : isSignedIn ? (
              <AddressSelector
                addresses={addresses}
                selected={selectedAddress}
                onSelect={setSelectedAddress}
                onCreated={handleAddressCreated}
                onUpdated={handleAddressUpdated}
                onDeleted={handleAddressDeleted}
              />
            ) : (
              <GuestCheckoutForm
                value={guestInfo}
                onChange={setGuestInfo}
                errors={guestErrors}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="w-full bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <PriceFormatter amount={subTotalPrice} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Giảm giá</span>
                  <PriceFormatter amount={subTotalPrice - totalPrice} />
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <PriceFormatter
                    amount={totalPrice}
                    className="text-lg font-bold text-black"
                  />
                </div>
                <Button
                  className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                  size="lg"
                  disabled={loading}
                  onClick={handlePlaceOrder}
                >
                  {loading ? "Vui lòng đợi…" : "Đặt hàng"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {payment && (
        <PaymentDialog
          open
          orderNumber={payment.orderNumber}
          amount={payment.amount}
          redirectUrl={payment.redirectUrl}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
