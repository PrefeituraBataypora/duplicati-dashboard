"use client";
import { Hour } from "@/components/navbar/hour";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTabStore } from "@/providers/tab";
import { toast } from "sonner";
import { CreateDevice } from "@/components/device/create";
import { ChangeThemeDropdown } from "./change-theme";
import { RotateCcw } from "lucide-react";

const Navbar = () => {
  const { counter, setCounter } = useTabStore((state) => state);

  return (
    <div className="w-full border rounded-md p-2 h-12 flex items-center justify-between">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <ChangeThemeDropdown />
        <CreateDevice />
        <Button
          className="flex items-center gap-2"
          variant="secondary"
          onClick={() => {
            setCounter(counter + 1);
            toast("Atualizando informações");
          }}
        >
          <RotateCcw />
          Atualizar
        </Button>
        <Hour />
      </div>
    </div>
  );
};

export { Navbar };
