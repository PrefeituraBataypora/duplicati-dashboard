"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LaptopMinimal, Moon, Sun } from "lucide-react";

const ChangeThemeDropdown = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2" variant="secondary">
          {theme === "dark" && <Moon />}
          {theme === "light" && <Sun />}
          {theme === "system" && <LaptopMinimal />}
          Tema
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          className="flex items-center gap-2"
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          <Sun size={16} />
          Claro
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="flex items-center gap-2"
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <Moon size={16} />
          Escuro
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="flex items-center gap-2"
          checked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          <LaptopMinimal size={16} />
          Sistema
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ChangeThemeDropdown };
