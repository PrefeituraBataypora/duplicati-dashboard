"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { SystemInfo } from "@/types/system-info";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SystemInfoProps {
    systemInfo: SystemInfo
}

const SystemInfo = ({ systemInfo }: SystemInfoProps) => {
    const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);

    return (
        <Collapsible
        open={isSystemInfoOpen}
        onOpenChange={setIsSystemInfoOpen}
        className="flex flex-col gap-2"
      >
        <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md border p-2">
          Informações do Sistema
          {isSystemInfoOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <CollapsibleContent className="border rounded-md p-2">
          <p>Nome da máquina: {systemInfo?.MachineName}</p>
          <p>Nome de usuário: {systemInfo?.UserName}</p>
          <p>Sistema Operacional: {systemInfo?.OSType}</p>
          <p>Versão do Sistema: {systemInfo?.OSVersion}</p>
        </CollapsibleContent>
      </Collapsible>
    )
}

export { SystemInfo }