"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ColevitateMark({ className = "size-6" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logoSrc = mounted && resolvedTheme === "dark" ? "/logo.png" : "/logo-light.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="Colevitate" className={`${className} object-contain`} />
  );
}
