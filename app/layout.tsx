import { ThemeProvider } from "@/components/theme-provider";
import { PropsWithChildren } from "react";
import { AsyncComponent } from "@/lib/types";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const Layout: AsyncComponent<PropsWithChildren> = async({ children }) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
      <body className={cn(poppins.className, "antialiased dark:bg-[#171616] dark:text-white")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 border-x border-neutral-200 dark:border-neutral-800">
                <div className="sticky hidden md:block top-0 z-50 h-3" />
                <main className="max-w-full mx-auto py-4 px-4">{children}</main>
              </div>
            </div>

            <Toaster richColors />

            {/* <div className="absolute right-4 bottom-4 flex flex-row items-center space-x-1">
              <ThemeSwitcher />
              <LanguageSelector />
            </div> */}
          </NextIntlClientProvider>          
        </ThemeProvider>
      </body>
    </html>
  );
}


export default Layout;