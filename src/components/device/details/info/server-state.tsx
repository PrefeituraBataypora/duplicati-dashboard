"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ServerState } from "@/types/server-state";
import { dayjs } from "@/lib/dayjs";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ServerStateProps {
  serverState: ServerState;
}

const ServerState = ({ serverState }: ServerStateProps) => {
  const [isServerStateOpen, setIsServerStateOpen] = useState(false);

  return (
    <Collapsible
      open={isServerStateOpen}
      onOpenChange={setIsServerStateOpen}
      className="flex flex-col gap-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md border p-2">
        Status do servidor
        {isServerStateOpen ? <ChevronUp /> : <ChevronDown />}
      </CollapsibleTrigger>
      <CollapsibleContent className="border rounded-md p-2">
        <p>Status do Programa: {serverState?.ProgramState}</p>
        <p>
          Agendamentos:{" "}
          {serverState?.ProposedSchedule.length === 0 &&
            "Nenhum backup agendado"}
          {serverState?.ProposedSchedule.length !== 0 &&
            serverState?.ProposedSchedule.map(({ Item1, Item2 }) => {
              return (
                <div key={Item1} className="border rounded-md p-2">
                  <p>ID do Backup: {Item1}</p>
                  <p>{dayjs().to(Item2)}</p>
                </div>
              );
            })}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { ServerState };