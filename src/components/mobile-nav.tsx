"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "◧" },
  { href: "/trades", label: "Log", icon: "☰" },
  { href: "/trades/new", label: "Add", icon: "+" },
  { href: "/analytics", label: "Stats", icon: "▤" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-surface-container-high flex justify-around py-2 z-20">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-body-sm ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
