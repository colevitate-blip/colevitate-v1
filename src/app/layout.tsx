import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://colevitate.com"),
  title: "Colevitate — Personality Studio",
  description:
    "Colevitate combines 16 Personalities, Big Five, Human Design, and 4 Color Types into one personality profile.",
  openGraph: {
    siteName: "Colevitate",
    title: "Colevitate — Personality Studio",
    description:
      "Colevitate combines 16 Personalities, Big Five, Human Design, and 4 Color Types into one personality profile.",
    url: "https://colevitate.com",
  },
};

// Resolves the theme before first paint to prevent flash during hydration.
// Uses system preference (prefers-color-scheme); manual toggle via next-themes always wins.
const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('colevitate-theme');
    if (stored) {
      if (stored === 'dark') document.documentElement.classList.add('dark');
      return;
    }
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="colevitate-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
