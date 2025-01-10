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
import { GoogleOneTap } from "@/components/auth/one-tap";
import { TanStackQuery } from "@/components/providers/tanstack-query";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

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
        <TanStackQuery>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="h-6" />
                    </div>
                  </header>

                  {/* <div className="flex min-h-screen">
                    <div className="flex-1 border-x border-neutral-200 dark:border-neutral-800">
                      <div className="sticky hidden md:block top-0 z-50 h-3" />
                      <main className="max-w-full mx-auto py-1 px-1 sm:py-4 sm:px-4">{children}</main>
                    </div>
                  </div> */}

                  <main className="py-2 px-2 sm:py-4 sm:px-4">
                    {children}
                  </main>

                  <Toaster richColors />
                  <GoogleOneTap />
                </SidebarInset>
              </SidebarProvider>
            </NextIntlClientProvider>          
          </ThemeProvider>
        </TanStackQuery>
      </body>
    </html>
  );
}


export default Layout;