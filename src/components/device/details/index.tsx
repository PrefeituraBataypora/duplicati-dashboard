"use client";

import { getDeviceInfo } from "@/actions/device/get-device-info";
import { useTabStore } from "@/providers/tab";
import { useQuery } from "@tanstack/react-query";
import { SystemInfo } from "./info/system";
import { ServerState } from "./info/server-state";
import { Updates } from "./info/updates";
import { Backups } from "./info/backup";

const DetailsPage = () => {
  const { ip } = useTabStore((state) => state);

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
      {device.backups && <Backups backups={device.backups} />}
      {/* @ts-expect-error type error */}
      {device.serverState && <ServerState serverState={device.serverState} />}
      {device.systemInfo && <SystemInfo systemInfo={device.systemInfo} />}
      <Updates device={device} />
    </div>
  );
};

export { DetailsPage };
