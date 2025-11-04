"use client";

import { useState } from "react";
import egyptFlagImage from "@/assets/imgs/Egypt-flag.svg";
import logoImage from "@/assets/imgs/logo.png";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  PopoverGroup,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import SideCart from "../global/cart/SideCart";
import { useMe, useLogout } from "@/hooks";
import { toast } from "sonner";

const navigation = {
  categories: [],
  pages: [
    { name: "About", href: "/about" },
    { name: "Recommendations", href: "/recommendations" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const handleCartOpen = () => {
    setCartOpen(true);
    navigate("/checkout");
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {user ? (
                <>
                  <div className="flow-root">
                    <Link
                      to="/profile"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        <span>{user.name || user.email}</span>
                      </div>
                    </Link>
                  </div>
                  {user.roles?.includes("admin") && (
                    <div className="flow-root">
                      <Link
                        to="/dashboard"
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                  <div className="flow-root">
                    <button
                      onClick={handleLogout}
                      className="-m-2 block p-2 font-medium text-gray-900 w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <Link
                      to="/login"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/register"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt="Egypt Flag"
                  src={egyptFlagImage}
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  EGP
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Tgmi3ah Store</span>
                  <img
                    alt="Tgmi3ah Store Logo"
                    src={logoImage}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {user ? (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <UserIcon className="h-5 w-5" />
                      <span>{user.name || user.email}</span>
                    </div>
                    {user.roles?.includes("admin") && (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-6 w-px bg-gray-200"
                        />
                        <Link
                          to="/dashboard"
                          className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          Dashboard
                        </Link>
                      </>
                    )}
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign in
                    </Link>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <Link
                      to="/register"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Create account
                    </Link>
                  </div>
                )}

                <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      alt="Egypt Flag"
                      src={egyptFlagImage}
                      className="block h-auto w-5 shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">EGP</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Button
                    variant="ghost"
                    className="group -m-2 flex items-center p-2"
                    onClick={handleCartOpen}
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <SideCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
