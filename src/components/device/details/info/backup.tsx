"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Backup, Schedule } from "@prisma/client";
import dayjs from "dayjs";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Logs } from "../log";

interface BackupProps {
  deviceIp: string;
  backups: Backup[];
}

const Backups = ({ backups, deviceIp }: BackupProps) => {
  const [isBackupInfoOpen, setIsBackupInfoOpen] = useState(false);

  return (
    <Collapsible
      open={isBackupInfoOpen}
      onOpenChange={setIsBackupInfoOpen}
      className="flex flex-col gap-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md border p-2">
        Backups
        {isBackupInfoOpen ? <ChevronUp /> : <ChevronDown />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {backups.length === 0 && "Nenhum backup encontrado"}
        {backups.length !== 0 &&
          backups.map((backup) => {
            return (
              <div key={backup.id} className="border rounded-md p-2">
                <p>ID do Backup (duplicati): {backup.duplicatiId}</p>
                <p>Nome do Backup (duplicati): {backup.name}</p>
                <p>
                  Descrição do Backup:{" "}
                  {backup.description ? backup.description : "Sem descrição"}
                </p>
                {/* If you are saving to a location that requires authentication (e.g. ssh), duplicati does not hide sensitive credentials, be careful when displaying the next line */}
                {/* <p>Local de Salvamento: {backup.targetUrl}</p> */}
                <div>
                  Agendamentos:
                  {/* @ts-expect-error prisma type */}
                  {backup.schedule.length === 0 && "Nenhum agendamento"}
                  {/* @ts-expect-error prisma type */}
                  {backup.schedule.length !== 0 &&
                    // @ts-expect-error prisma type
                    backup.schedule.map((schedule: Schedule, index: number) => {
                      return (
                        <div key={schedule.id} className="ml-3">
                          <p>
                            Agendamento {index + 1}: se repete a cada{" "}
                            {schedule.repeat}
                          </p>
                          <p>
                            Última execução:{" "}
                            {dayjs(schedule.lastRun).add(1, "hours").fromNow()}
                          </p>
                          <p>
                            Próxima execução:{" "}
                            {dayjs(schedule.time).add(1, "hour").fromNow()}
                          </p>
                        </div>
                      );
                    })}
                </div>
                <div>
                  Estatísticas:
                  <p>
                    Duração do último backup:{" "}
                    {/* @ts-expect-error prisma json type */}
                    {backup.metadata.LastBackupDuration}
                  </p>
                  <p>
                    Tamanho do último backup:{" "}
                    {/* @ts-expect-error prisma json type */}
                    {backup.metadata.TargetSizeString}
                  </p>
                  <p>
                    Número de arquivos:{" "}
                    {/* @ts-expect-error prisma json type */}
                    {backup.metadata.SourceFilesCount}
                  </p>
                </div>
                <Logs backup={backup} deviceIp={deviceIp} />
              </div>
            );
          })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export { Backups };
