"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navbar as NavbarLayout,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (pathname === "/auth" || pathname === "/connect-aws" || pathname === "/timeline") return null;

  // New requested navbar items
  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Timeline", link: "/timeline" },
    { name: "Sign In / Sign Up", link: "/auth" },
  ];

  return (
    <NavbarLayout className="mt-2">
      {/* --- DESKTOP NAVBAR --- */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <NavbarButton href="/connect-aws" variant="primary">
          Connect AWS
        </NavbarButton>
      </NavBody>

      {/* --- MOBILE NAVBAR --- */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="block w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <NavbarButton href="/connect-aws" className="w-full mt-4">
            Connect AWS
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </NavbarLayout>
  );
}
