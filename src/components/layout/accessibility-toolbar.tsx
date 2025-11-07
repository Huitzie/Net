
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Accessibility,
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { useTheme } from "@/lib/theme"

export function AccessibilityToolbar() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme()

  const FONT_SIZES = [
    {
      name: "Small",
      value: 0.9,
    },
    {
      name: "Default",
      value: 1,
    },
    {
      name: "Medium",
      value: 1.1,
    },
    {
      name: "Large",
      value: 1.2,
    },
  ]

  const THEMES = [
    {
      name: "Light",
      icon: Sun,
    },
    {
      name: "Dark",
      icon: Moon,
    },
    {
      name: "High Contrast",
      icon: Monitor,
    },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <SidebarProvider defaultOpen={false}>
        <Sidebar
          side="right"
          variant="floating"
          collapsible="offcanvas"
          className="w-80"
        >
          <SidebarHeader className="h-0">
             <SidebarTrigger className="absolute bottom-0 right-0">
              <Accessibility />
            </SidebarTrigger>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Accessibility className="size-4" />
                <span>Accessibility</span>
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Increase font size"
                    onClick={() => setFontSize(fontSize + 0.1)}
                    size="sm"
                  >
                    <ZoomIn />
                    <span>Increase font size</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Decrease font size"
                    onClick={() => setFontSize(fontSize - 0.1)}
                    size="sm"
                  >
                    <ZoomOut />
                    <span>Decrease font size</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Font size</SidebarGroupLabel>
              <SidebarMenu>
                {FONT_SIZES.map((size) => (
                  <SidebarMenuItem key={size.name}>
                    <SidebarMenuButton
                      onClick={() => setFontSize(size.value)}
                      size="sm"
                      isActive={fontSize === size.value}
                    >
                      <Type />
                      <span>{size.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Theme</SidebarGroupLabel>
              <SidebarMenu>
                {THEMES.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => setTheme(item.name.toLowerCase().replace(" ", "-"))}
                      size="sm"
                      isActive={theme === item.name.toLowerCase().replace(" ", "-")}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
