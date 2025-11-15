import { logo } from "@/assets/images";
import CustomLayout from "@/components/CustomLayout";
import { Button } from "@/components/ui/button";
import { navBar } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
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
          <Button className="bg-primary text-white rounded-full font-medium text-sm px-10 py-5">
            Sign Up
          </Button>
        </nav>
      </CustomLayout>
    </header>
  );
};

export default Navbar;
