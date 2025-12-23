"use client";

import { useEffect, useState } from "react";
import { navBar } from "@/constants";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CustomLayout from "@/components/CustomLayout";
import Image from "next/image";
import { logo, profile } from "@/assets/images";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "w-full z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "fixed top-0 bg-white/60 shadow-lg backdrop-blur-md"
          : "absolute top-0 "
      )}
    >
      <CustomLayout>
        <nav className="flex items-center justify-between py-2">
          <Link href="/">
            <Image src={logo} alt="Skill-Connect" width={100} height={100} />
          </Link>

          <div className="hidden md:flex items-center gap-5 font-bold text-sm">
            {navBar.map((item) => {
              const isActive = pathname === item.link;

              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className={clsx(
                    "relative font-bold text-sm transition-colors",
                    isActive ? "text-primary" : "text-black"
                  )}
                >
                  {item.name}

                  {/* underline */}
                  <span
                    className={clsx(
                      "absolute left-0 -bottom-1 h-0.5 w-full rounded-full transition-all duration-300",
                      isActive
                        ? "bg-primary scale-x-100"
                        : "bg-transparent scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Image
                    src={session.user.image || profile}
                    alt={session.user.name}
                    width={35}
                    height={30}
                    className="rounded-full"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="bg-red-500 w-full text-white">
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">Login</Link>
            )}

            <Sheet>
              <SheetTrigger className="block md:hidden">
                <Menu />
              </SheetTrigger>

              <SheetContent className="bg-white">
                <SheetHeader className="h-full">
                  <SheetTitle>
                    <Link href="/">
                      <Image
                        src={logo}
                        alt="Skill-Connect"
                        width={100}
                        height={100}
                      />
                    </Link>
                  </SheetTitle>

                  <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
                    {navBar.map((item) => {
                      const isActive = pathname === item.link;

                      return (
                        <SheetClose key={item.name} asChild>
                          <Link
                            href={item.link}
                            className={clsx(
                              "relative text-xl font-medium",
                              isActive && "text-primary"
                            )}
                          >
                            {item.name}

                            <span
                              className={clsx(
                                "absolute left-0 -bottom-1 h-[3px] w-full rounded-full transition-all",
                                isActive ? "bg-primary" : "bg-transparent"
                              )}
                            />
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </CustomLayout>
    </header>
  );
};

export default Navbar;
