"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="text-white p-4 flex justify-center space-x-6 z-10 fixed w-full uppercase text-[8px]">
      <MemoizedNavLink href="/" pathname={pathname}>
        Hyperspace Gates
      </MemoizedNavLink>
      <MemoizedNavLink href="/journey-cost" pathname={pathname}>
        Journey Cost
      </MemoizedNavLink>
      <MemoizedNavLink href="/route-finder" pathname={pathname}>
        Route Finder
      </MemoizedNavLink>
    </nav>
  );
}

const NavLink = React.memo(function NavLink({
  href,
  children,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition-all font-light text-sm tracking-wide pb-1 relative ${
        isActive
          ? "text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
});

const MemoizedNavLink = React.memo(NavLink);
