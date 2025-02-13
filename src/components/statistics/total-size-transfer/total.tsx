"use client";

import { getTotalBackupsSize } from "@/actions/statistics/get-total-backup-size";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";
import { bytesConverter } from "@/lib/bytes-converter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pie, PieChart } from "recharts";
import { toast } from "sonner";

const TotalSizeTransfer = () => {
  const [sizeType, setSizeType] = useState<"MB" | "GB" | "TB">("MB");
  const { data, isError } = useQuery({
    queryKey: ["total-backup-size"],
    queryFn: getTotalBackupsSize,
    staleTime: 0,
  });

  if (isError) {
    toast.error("Erro ao obter o tamanho total dos backups");
    return (
      <div className="w-full lg:max-w-[49.5%] md:max-w-full max-h-[38rem] border rounded-md p-2 flex flex-col gap-2">
        <p>Total de Dados Transferidos</p>
        <p>Erro ao obter o tamanho total dos backups</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full lg:max-w-[49.5%] md:max-w-full max-h-[38rem] border rounded-md p-2 flex flex-col gap-2">
        <p>Total de Dados Transferidos</p>
        <p>Não foi possível obter o tamanho total dos backups</p>
      </div>
    );
  }

  const { total, totalAdded, totalModified } = data;

  const totalConverted = bytesConverter({ bytes: total, type: sizeType });
  const totalAddedConverted = bytesConverter({
    bytes: totalAdded,
    type: sizeType,
  });
  const totalModifiedConverted = bytesConverter({
    bytes: totalModified,
    type: sizeType,
  });

  const addedPercentage = (totalAddedConverted / totalConverted) * 100;
  const modifiedPercentage = (totalModifiedConverted / totalConverted) * 100;

  const chartConfig = {
    value: {
      label: "Total",
    },
    modificados: {
      label: "Modificados",
      color: "hsl(var(--chart-1))",
    },
    adicionados: {
      label: "Adicionados",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = [
    {
      type: "Modificados",
      value: modifiedPercentage,
      fill: "var(--color-modificados)",
    },
    {
      type: "Adicionados",
      value: addedPercentage,
      fill: "var(--color-adicionados)",
    },
  ];

  return (
    <Card className="w-full lg:max-w-[49.5%] md:max-w-full max-h-[38rem] flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center justify-between gap-2">
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
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="value" nameKey="type" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>
          A contagem é feita a partir dos logs dos últimos 30 dias.
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export { TotalSizeTransfer };
