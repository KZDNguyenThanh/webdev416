import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import { getMyOrders } from "@/lib/repositories/commerce.repository";
import { getCurrentUser } from "@/lib/auth/server";

const Header = async () => {
  const user = await getCurrentUser();
  let orders = null;
  if (user?.id) {
    orders = await getMyOrders(user.id);
  }

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <div className="flex items-center gap-2.5 justify-start md:hidden">
          <MobileMenu />
          <Logo />
        </div>

        <div className="hidden md:flex items-center justify-start min-w-0">
          <HeaderMenu />
        </div>

        <div className="hidden md:flex items-center justify-center">
          <Logo />
        </div>

        <div className="w-auto flex items-center justify-end gap-3 md:gap-4 md:min-w-0">
          <div className="flex items-center gap-3 md:gap-4">
            <SearchBar />
            <CartIcon />
            <FavoriteButton />
          </div>

          <div className="flex justify-end">
            {user ? (
              <UserMenu
                fullName={user.fullName}
                role={user.role}
                ordersCount={orders?.length ?? 0}
              />
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
