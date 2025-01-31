"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"
import { ComponentProps, useEffect, useState } from "react"
import { Home, Bell, User, Sun, Moon, Feather } from "lucide-react"
import { useSession } from "@/lib/auth/client"
import { Component } from "@/lib/types"
import { useTheme } from "next-themes"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { LanguageSelector } from "../language-selector"
import { useTranslations } from "next-intl"
import usePollingNotifications from "@/hooks/use-notification-polling"
import { useQueryClient } from "@tanstack/react-query"
import { getNotifications } from "@/lib/actions/notifications/notification.action"

export const AppSidebar: Component<ComponentProps<typeof Sidebar> & {
  notifications?: number
}> = ({ ...props }) => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();
  const notifications = usePollingNotifications();
  
  const t = useTranslations("Sidebar");


  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SocialNet</span>
                  <span className="truncate text-xs">Connect & Share</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[
          { title: "Home", icon: Home, url: "/" },
          // { title: "Explore", icon: Hashtag, url: "#" },
          {
            title: "Notifications",
            icon: Bell,
            url: "/notifications",
            numberBadge: notifications ?? 0,
            onMouseEnter: () => {
              console.log("prefetching notifications")
              queryClient.prefetchQuery({
                queryKey: ["notifications"],
                queryFn: () => getNotifications()
              })
            }
          },
          // { title: "Messages", icon: Mail, url: "#" },
          // { title: "Bookmarks", icon: Bookmark, url: "#" },
          { title: "Profile", icon: User, url: `/${session?.user.username}` }
        ]} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span>
              {t("SwitchTheme")}
            </span>
          </SidebarMenuButton>
        </SidebarMenu>

        <LanguageSelector />

        <NavUser user={{
          avatar: session?.user.image ?? "",
          name: session?.user.name ?? "",
          handle: session?.user.username ?? ""
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}