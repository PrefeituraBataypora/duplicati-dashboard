"use client";

import { updateLogs } from "@/actions/device/update-logs";
import { Button } from "@/components/ui/button";
import { Backup } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Download, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LogsProps {
  deviceIp: string;
  backup: Backup;
}

const Logs = ({ deviceIp, backup }: LogsProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (refreshTrigger === 0) return;

    updateLogs({ backup: { id: backup.id } })
      .then(() => {
        toast.success(`Logs atualizados para o backup ${backup.id}`);
        queryClient.invalidateQueries({ queryKey: ["device-item", deviceIp] });
      })
      .catch((err) => {
        toast.error(`Erro ao atualizar logs para o backup ${backup.id}`);
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDownload = () => {
    // Converte para string JSON formatada
    // @ts-expect-error logs existe
    const jsonString = JSON.stringify(backup.logs, null, 2);

    // Cria um Blob (arquivo virtual na memória)
    const blob = new Blob([jsonString], { type: "application/json" });

    // Cria um link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dados.json"; // Nome do arquivo

    // Simula o clique no link para baixar o arquivo
    document.body.appendChild(a);
    a.click();

    // Remove o link após o download
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-md w-full p-2 flex items-center justify-between">
      <p>Logs</p>
      <div className="flex items-center gap-2">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download />
          Baixar Logs
        </Button>
        <Button
          onClick={() => setRefreshTrigger(refreshTrigger + 1)}
          className="flex items-center gap-2"
        >
          <RotateCcw />
          Atualizar Logs
        </Button>
      </div>
    </div>
  );
};

export { Logs };
