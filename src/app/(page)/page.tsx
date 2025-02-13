"use client";
import { getDevices } from "@/actions/device/get-devices";
import { DetailsPage } from "@/components/device/details";
import { DevicesTable } from "@/components/device/table";
import { DeviceTableItem } from "@/components/device/table/item";
import { StatisticsPage } from "@/components/statistics";
import { useTabStore } from "@/providers/tab";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { tab } = useTabStore((state) => state);

  const { data: devices, isFetching } = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  if (!devices || isFetching) {
    return <div>Não há dispositivos</div>;
  }

  if (tab === "details") {
    return <DetailsPage />;
  }

  if (tab === "statistics") {
    return <StatisticsPage />;
  }

  return (
    <div>
      <DevicesTable>
        {devices.map((device) => {
          return <DeviceTableItem key={device.id} device={device} />;
        })}
      </DevicesTable>
    </div>
  );
};

export default Page;
