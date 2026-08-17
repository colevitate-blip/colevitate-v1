"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleClick = () => {
    // Mark this as an explicit manual choice so the no-flash boot script (in
    // src/app/layout.tsx) stops recomputing the theme from local time on future loads.
    try {
      localStorage.setItem("colevitate-theme-manual", "true");
    } catch {
      // ignore (e.g. private browsing)
    }
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label="Toggle theme"
      onClick={handleClick}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
