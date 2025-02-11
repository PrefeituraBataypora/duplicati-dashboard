"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Device } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { dayjs } from "@/lib/dayjs";

interface UpdatesProps {
    device: Device;
}

const Updates = ({ device }: UpdatesProps) => {
  const [isUpdatesInfoOpen, setIsUpdatesInfoOpen] = useState(false);

  return (
    <Collapsible
      open={isUpdatesInfoOpen}
      onOpenChange={setIsUpdatesInfoOpen}
      className="flex flex-col gap-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md border p-2">
        Atualizações
        {isUpdatesInfoOpen ? <ChevronUp /> : <ChevronDown />}
      </CollapsibleTrigger>
      <CollapsibleContent className="border rounded-md p-2">
        <p>Último status: {device.state}</p>
        <p>Última checagem {dayjs().to(device.lastCheck)}</p>
        <p>Última atualização: {dayjs().to(device.lastCheck)} </p>
        <p>Última vez visto: {dayjs().to(device.lastSync)} </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { Updates };