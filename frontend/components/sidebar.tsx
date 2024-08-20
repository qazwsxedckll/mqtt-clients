"use client";

import Link from "next/link";
import { navigations } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navigations.map((navigation) => (
        <Link
          key={navigation.name}
          href={navigation.href}
          className={
            `flex items-center gap-3 rounded-lg px-3 py-2 hover:text-primary transition-all` +
            (pathname === navigation.href
              ? " bg-muted text-primary"
              : "text-muted-foreground")
          }
        >
          <navigation.icon className="h-5 w-5" />
          {navigation.name}
        </Link>
      ))}
    </nav>
  );
}
