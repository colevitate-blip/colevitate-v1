"use client";

import { useState } from "react";
import { Compass, LayoutGrid, Menu, Star, Users, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** sm:hidden hamburger menu — the inline pill row (rendered separately in the layout)
 * takes over at sm: and up, where there's room for full labels without a menu. Icons are
 * imported here rather than passed in as props: component references aren't serializable
 * across the server/client boundary, only the translated label strings are. */
export function MobileNavMenu({
  menuLabel,
  discoverLabel,
  peopleLabel,
  typesLabel,
  teamsLabel,
}: {
  menuLabel: string;
  discoverLabel: string;
  peopleLabel: string;
  typesLabel: string;
  teamsLabel: string;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/discover" as const, label: discoverLabel, icon: Compass },
    { href: "/people" as const, label: peopleLabel, icon: Star },
    { href: "/types" as const, label: typesLabel, icon: LayoutGrid },
    { href: "/teams" as const, label: teamsLabel, icon: Users },
  ];

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={menuLabel}
        className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-30" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border bg-card p-2 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <item.icon className="size-4 text-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
