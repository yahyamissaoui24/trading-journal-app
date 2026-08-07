"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoWithWordmark } from "@/components/logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "◧" },
  { href: "/trades", label: "Trade Log", icon: "☰" },
  { href: "/trades/new", label: "New Trade", icon: "+" },
  { href: "/analytics", label: "Analytics", icon: "▤" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

const MIN_WIDTH = 180;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 240;
const STORAGE_KEY = "apex-journal:sidebar-width";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [resizing, setResizing] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed)) setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed)));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  }, []);

  useEffect(() => {
    if (!resizing) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = asideRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - rect.left));
      setWidth(next);
    }

    function handleMouseUp() {
      setResizing(false);
      setWidth((current) => {
        window.localStorage.setItem(STORAGE_KEY, String(current));
        return current;
      });
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [resizing]);

  return (
    <aside
      ref={asideRef}
      style={{ width }}
      className="hidden md:flex md:flex-col shrink-0 relative bg-surface-container-low border-r border-surface-container-high h-screen sticky top-0"
    >
      <div className="px-stack-lg py-stack-lg overflow-hidden">
        <LogoWithWordmark size={28} />
      </div>

      <nav className="flex-1 px-stack-sm space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-stack-md py-stack-sm rounded text-body-md transition-colors whitespace-nowrap overflow-hidden ${
                active
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary" />
              )}
              <span className="w-5 text-center shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-stack-md py-stack-lg border-t border-surface-container-high overflow-hidden">
        {session?.user?.plan === "FREE" ? (
          <Link
            href="/pricing"
            className="block mb-stack-sm rounded-md bg-tertiary/10 border border-tertiary/30 px-stack-md py-stack-sm text-body-sm text-tertiary hover:bg-tertiary/15 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
          >
            ★ Upgrade to Premium
          </Link>
        ) : (
          <div className="mb-stack-sm rounded-md bg-primary/10 border border-primary/30 px-stack-md py-stack-sm text-body-sm text-primary whitespace-nowrap overflow-hidden text-ellipsis">
            ★ Premium active
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-sm text-on-surface-variant truncate">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors shrink-0"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/40 transition-colors ${
          resizing ? "bg-primary/50" : ""
        }`}
        title="Drag to resize"
      />
    </aside>
  );
}
