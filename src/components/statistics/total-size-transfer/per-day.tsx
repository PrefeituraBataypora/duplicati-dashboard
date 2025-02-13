"use client";

import { getTotalBackupsSizePerDay } from "@/actions/statistics/get-total-backup-size-per-day";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";
import { bytesConverter } from "@/lib/bytes-converter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { toast } from "sonner";

const TotalSizeTransferPerDay = () => {
  const { data, isError } = useQuery({
    queryKey: ["total-backup-size-per-day"],
    queryFn: getTotalBackupsSizePerDay,
    staleTime: 0,
  });
  const [sizeType, setSizeType] = useState<"MB" | "GB" | "TB">("MB");

  if (isError) {
    toast.error("Erro ao obter o tamanho total dos backups");
    return (
      <div className="h-full w-full border rounded-md p-2 flex flex-col gap-2">
        <p>Total de Dados Transferidos</p>
        <p>Erro ao obter o tamanho total dos backups</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full border rounded-md p-2 flex flex-col gap-2">
        <p>Total de Dados Transferidos</p>
        <p>Não foi possível obter o tamanho total dos backups</p>
      </div>
    );
  }

  const { totalSizePerDay } = data;

  const chartConfig = {
    tamanho: {
      label: "Tamanho",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const dataFormatted = totalSizePerDay.map((item) => {
    return {
      ...item,
      total: bytesConverter({ bytes: item.totalAdded + item.totalModified, type: sizeType }),
    }
  });
  
  return (
    <Card className="lg:max-w-[49.5%] md:max-w-full w-full max-h-[38rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p>Total de Dados Transferidos</p>
          <div className="flex items-center gap-2">
            <Toggle
              pressed={sizeType === "MB"}
              variant="outline"
              size="sm"
              onClick={() => setSizeType("MB")}
            >
              MB
            </Toggle>
            <Toggle
              pressed={sizeType === "GB"}
              variant="outline"
              size="sm"
              onClick={() => setSizeType("GB")}
            >
              GB
            </Toggle>
            <Toggle
              pressed={sizeType === "TB"}
              variant="outline"
              size="sm"
              onClick={() => setSizeType("TB")}
            >
              TB
            </Toggle>
          </div>
        </CardTitle>
        <CardDescription>
          Separação do tamanho total dos backups por dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dataFormatted}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line dataKey={"total"} type="monotone" dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { TotalSizeTransferPerDay };
