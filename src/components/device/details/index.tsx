"use client";

import { getDeviceInfo } from "@/actions/device/get-device-info";
import { useTabStore } from "@/providers/tab";
import { useQuery } from "@tanstack/react-query";
import { dayjs } from "@/lib/dayjs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DetailsPage = () => {
  const { ip } = useTabStore((state) => state);
  const [isBackupInfoOpen, setIsBackupInfoOpen] = useState(false);
  const [isServerStateOpen, setIsServerStateOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);

  const { data: device } = useQuery({
    queryKey: ["device-item", ip],
    queryFn: async () => getDeviceInfo({ id: ip as string }),
  });

  if (!device) {
    return <div>Dispositivo não encontrado</div>;
  }

  return (
    <div className="h-full w-full border rounded-md p-2 flex flex-col gap-2">
      <p className="text-2xl font-semibold">
        {device.alias && device.alias + " - "}
        {device.ip}
      </p>
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
          {device.backups.length === 0 && "Nenhum backup encontrado"}
          {device.backups.length !== 0 &&
            device.backups.map((backup) => {
              return (
                <div key={backup.id} className="border rounded-md p-2">
                  <p>ID do Backup (duplicati): {backup.duplicatiId}</p>
                  <p>
                    Descrição do Backup:{" "}
                    {backup.description ? backup.description : "Sem descrição"}
                  </p>
                  <p>Local de Salvamento: {backup.targetUrl}</p>
                  <div>
                    Agendamentos:
                    {backup.schedule.length === 0 && "Nenhum agendamento"}
                    {backup.schedule.length !== 0 &&
                      backup.schedule.map((schedule, index) => {
                        return (
                          <div key={schedule.id} className="ml-3">
                            <p>
                              Agendamento {index + 1}: se repete a cada {schedule.repeat}
                            </p>
                            <p>
                              Última execução:{" "}
                              {dayjs(schedule.lastRun)
                                .add(1, "hours")
                                .fromNow()}
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
                </div>
              );
            })}
        </CollapsibleContent>
      </Collapsible>
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
          <p>Status do Programa: {device.serverState?.ProgramState}</p>
          <p>
            Agendamentos:{" "}
            {device.serverState?.ProposedSchedule.length === 0 &&
              "Nenhum backup agendado"}
            {device.serverState?.ProposedSchedule.length !== 0 &&
              // @ts-expect-error prisma json type
              device.serverState?.ProposedSchedule.map(({ Item1, Item2 }) => {
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
          <p>Nome da máquina: {device.systemInfo?.MachineName}</p>
          <p>Nome de usuário: {device.systemInfo?.UserName}</p>
          <p>Sistema Operacional: {device.systemInfo?.OSType}</p>
          <p>Versão do Sistema: {device.systemInfo?.OSVersion}</p>
        </CollapsibleContent>
      </Collapsible>
      <p>Último status: {device.state}</p>
      <p>Última checagem {dayjs().to(device.lastCheck)}</p>
      <p>Visto pela última vez {dayjs().to(device.lastSync)}</p>
      <p>Última atualização: {dayjs().to(device.lastCheck)} </p>
      <p>Última vez visto: {dayjs().to(device.lastSync)} </p>
    </div>
  );
};

export { DetailsPage };
