"use client";

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import AddressSelector from "@/components/AddressSelector";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PaymentDialog from "@/components/PaymentDialog";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AddressDTO } from "@/lib/types";
import { getMyAddresses } from "@/actions/catalog";
import { getImageUrl } from "@/lib/image";
import useStore from "@/store";
import { useAuthUser } from "@/hooks/useAuthUser";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn, user } = useAuthUser();
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(
    null,
  );
  const [payment, setPayment] = useState<{
    orderNumber: string;
    amount: number;
    redirectUrl: string;
  } | null>(null);

  const fetchAddresses = async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]); // Optional: select first address if no default
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressCreated = (address: AddressDTO) => {
    setAddresses((prev) => [address, ...prev]);
    setSelectedAddress(address);
  };
  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
    );
    if (confirmed) {
      resetCart();
      toast.success("Đã xóa giỏ hàng!");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    setLoading(true);
    try {
      const metadata: Metadata = {
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.email ?? "Unknown",
        userId: user?.id,
        addressId: selectedAddress.id,
      };
      const result = await createCheckoutSession(groupedItems, metadata);
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
  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Giỏ hàng</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?.id);
                      return (
                        <div
                          key={product?.id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md
                                 overflow-hidden group"
                              >
                                <Image
                                  src={getImageUrl(product?.images[0])}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Danh mục:{" "}
                                  <span className="font-semibold">
                                    {product?.categories?.length
                                      ? product.categories
                                          .map((cat) => cat.title)
                                          .join(", ")
                                      : "Khác"}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Trạng thái:{" "}
                                  <span className="font-semibold">
                                    {product?.status}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Thêm yêu thích
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?.id);
                                          toast.success("Đã xóa sản phẩm!");
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Xóa sản phẩm
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={product.price * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Xóa giỏ hàng
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Tóm tắt đơn hàng
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Tạm tính</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Giảm giá</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Tổng cộng</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Vui lòng đợi…" : "Đặt hàng"}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white rounded-md mt-5">
                      <AddressSelector
                        addresses={addresses}
                        selected={selectedAddress}
                        onSelect={setSelectedAddress}
                        onCreated={handleAddressCreated}
                      />
                    </div>
                  </div>
                </div>
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Tóm tắt đơn hàng</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading}
                        onClick={handleCheckout}
                      >
                        {loading ? "Please wait..." : "Place Order"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
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

export default CartPage;
