import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  title: "Personality Studio",
  description: "Discover your personality across four frameworks.",
};

// Resolves the theme before first paint, so there's no flash while React hydrates.
// Manual overrides (tracked via the "-manual" flag) always win; otherwise the theme
// is recomputed from local clock time on every load and written to the same
// storageKey next-themes reads on mount, so next-themes never fights this choice.
const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var manual = localStorage.getItem('colevitate-theme-manual') === 'true';
    if (manual) {
      var stored = localStorage.getItem('colevitate-theme');
      if (stored === 'dark') document.documentElement.classList.add('dark');
      return;
    }
    var hour = new Date().getHours();
    var theme = (hour >= 7 && hour < 19) ? 'light' : 'dark';
    localStorage.setItem('colevitate-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="colevitate-theme">
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
