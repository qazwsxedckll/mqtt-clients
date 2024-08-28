"use client";

import Link from "next/link";
import { navigations } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { Package2 } from "lucide-react";

export default function SidebarSheet() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Thingcross</span>
      </Link>
      {navigations.map((navigation) => (
        <Link
          key={navigation.name}
          href={navigation.href}
          className={
            `flex items-center gap-3 rounded-lg px-3 py-2 hover:text-primary transition-all` +
            (pathname === navigation.href
              ? " bg-muted text-foreground"
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
