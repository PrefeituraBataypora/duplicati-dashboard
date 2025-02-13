"use client";
import { updateDeviceBackupInfo } from "@/actions/device/update-backup-info";
import { updateDeviceInfo } from "@/actions/device/update-info";
import { updateDeviceServerState } from "@/actions/device/update-server-state";
import { updateDeviceSystemInfo } from "@/actions/device/update-system-info";
import { getDeviceInfo } from "@/actions/device/get-device-info";
import { TableCell, TableRow } from "@/components/ui/table";
import { fetchInfo } from "@/lib/fetch-info";
import { useTabStore } from "@/providers/tab";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { dayjs } from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { Pencil, Play, RefreshCcw } from "lucide-react";
import { DeleteDevice } from "../delete";
import { toast } from "sonner";

interface DeviceTableItemProps {
  device: {
    id: string;
    ip: string;
    port: number;
  };
}

const DeviceTableItem = ({
  device: { id, ip, port },
}: DeviceTableItemProps) => {
  const { counter } = useTabStore((state) => state);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: device, isFetching } = useQuery({
    queryKey: ["device-item", ip],
    queryFn: async () => getDeviceInfo({ id }),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (counter === 0 && refreshTrigger === 0) return;

    toast(`Atualizando informações do dispositivo ${ip}`);

    fetchInfo(ip, port)
      .then((data) => {
        updateDeviceInfo({
          device: {
            ip,
            alias: data[2].systemInfo.MachineName,
            state: "Conexão bem sucedida",
            lastCheck: new Date(),
            lastSync: new Date(),
          },
        });
        updateDeviceServerState({
          device: { ip },
          serverState: data[0].serverState,
        });
        updateDeviceBackupInfo({ device: { ip }, backupInfo: data[1].backups });
        updateDeviceSystemInfo({
          device: { ip },
          systemInfo: data[2].systemInfo,
        });
        queryClient.invalidateQueries({ queryKey: ["device-item", ip] });
        toast.success(`Informações do dispositivo ${ip} atualizadas`);
      })
      .catch(() => {
        updateDeviceInfo({
          device: {
            ip,
            state: "Erro de conexão",
            lastCheck: new Date(),
          },
        });
        queryClient.invalidateQueries({ queryKey: ["device-item", ip] });
        toast.error(`Erro ao atualizar informações do dispositivo ${ip}`);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, refreshTrigger]);

  if (!device) {
    return (
      <TableRow>
        <TableCell>{ip}</TableCell>
        <TableCell colSpan={5} className="text-center">
          Carregando informações do dispositivo {ip}
        </TableCell>
      </TableRow>
    );
  }

  if (isFetching) {
    return (
      <TableRow>
        <TableCell>{device.ip}</TableCell>
        <TableCell colSpan={5} className="text-center">
          Carregando informações do dispositivo {device.ip}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{device.ip}</TableCell>
      <TableCell>{device.alias}</TableCell>
      <TableCell>
        {device.serverState && device.serverState.ProposedSchedule.length > 0
          ? device.serverState.ProposedSchedule[0] &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dayjs().to((device.serverState.ProposedSchedule[0] as any).Item2)
          : "Nenhum backup agendado"}
      </TableCell>
      <TableCell>{device.state}</TableCell>
      <TableCell>{dayjs().to(device.updatedAt)}</TableCell>
      <TableCell className="flex items-center gap-2 !justify-end">
        <Button className="flex items-center gap-2" variant="outline">
          <Play />
          Iniciar Backup
        </Button>
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => setRefreshTrigger(counter + 1)}
        >
          <RefreshCcw />
          Atualizar
        </Button>
        <Button className="flex items-center gap-2" variant="outline">
          <Pencil />
          Editar
        </Button>
        <DeleteDevice id={device.id} ip={device.ip} />
      </TableCell>
    </TableRow>
  );
};

export { DeviceTableItem };
