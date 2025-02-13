"use client";
import { useTabStore } from "@/providers/tab";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { getDevices } from "@/actions/device/get-devices";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChartLine, LaptopMinimal, List, Smartphone } from "lucide-react";

const AppSidebar = () => {
  const { tab, setTab, ip, setDeviceIp } = useTabStore((state) => state);

  const { data: devices } = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <LaptopMinimal />
              <span>Duplicati Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dispositivos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={tab === "devices"}
                  onClick={() => {
                    setTab("devices");
                    setDeviceIp(undefined);
                  }}
                >
                  <List />
                  <span>Todos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={tab === "statistics"}
                  onClick={() => {
                    setTab("statistics");
                    setDeviceIp(undefined);
                  }}
                >
                  <ChartLine />
                  <span>Gráficos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton disabled={devices?.length === 0}>
                      <Smartphone />
                      <span>Dispositivos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {devices?.map((device) => {
                        return (
                          <SidebarMenuItem key={device.id}>
                            <SidebarMenuButton
                              isActive={ip === device.ip}
                              onClick={() => {
                                setTab("details");
                                setDeviceIp(device.ip);
                              }}
                            >
                              {device.ip}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
