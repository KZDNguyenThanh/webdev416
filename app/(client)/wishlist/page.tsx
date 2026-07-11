import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { getCurrentUser } from "@/lib/auth/server";
import React from "react";

const WishListPage = async () => {
  const user = await getCurrentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Đăng nhập để xem danh sách yêu thích của bạn và lưu lại những sản phẩm ưng ý!" />
      )}
    </>
  );
};

export default WishListPage;
