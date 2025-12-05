import { logo, profile } from "@/assets/images";

import CustomLayout from "@/components/CustomLayout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navBar } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { SignOutAction } from "@/server/users";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="bg-white shadow py-3 ">
      <CustomLayout>
        <nav className="flex  items-center justify-between">
          <Link href="/">
            <Image src={logo} alt="Logo" width={100} loading="lazy" />
          </Link>
          <ul className="flex items-center gap-5 ">
            {navBar.map((link, index) => (
              <Link
                href={link.link}
                key={index}
                className="capitalize text-sm font-bold"
              >
                {link.name}
              </Link>
            ))}
          </ul>
          {session ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="border-0 outline-none">
                  <Image
                    src={session.user?.image || profile}
                    alt="Logo"
                    height={30}
                    width={30}
                    loading="lazy"
                    className="rounded-full"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <form action={SignOutAction} className="w-full">
                      <Button className="w-full bg-red-500 hover:bg-red-500/90 text-white cursor-pointer font-bold">
                        Logout
                      </Button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/signIn"
              className="bg-primary text-white rounded-full font-medium text-sm px-10 py-2"
            >
              Sign In
            </Link>
          )}
        </nav>
      </CustomLayout>
    </header>
  );
};

export default Navbar;
