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
        <NoAccess details="Log in to view your wishlist items. Don’t miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;
