"use server";

import { prisma } from "@/lib/prisma";

interface UpdateLogsProps {
  backup: {
    id: string;
  };
}

const updateLogs = async ({ backup: { id } }: UpdateLogsProps) => {
  try {
    console.log(`Atualizando logs do backup ${id}`);
    const backup = await prisma.backup.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        device: true,
      },
    });

    const newLogs = await fetch(
      `http://${backup.device.ip}:${backup.device.port}/api/v1/backup/${backup.duplicatiId}/logs`
    )
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(err);
      });

    if (!newLogs.backupLogs) {
      throw new Error("Logs não encontrados");
    }

    if (newLogs.backupLogs.length === 0) {
      return null;
    }

    for (const log of newLogs.backupLogs) {
      console.log(`Atualizando log ${log.ID} do backup ${id}`);
      await prisma.backupLog
        .upsert({
          where: {
            logId: log.ID,
          },
          update: {
            exception: log.Exception,
            timestamp: new Date(log.Timestamp * 1000),
            message: log.Message,
            operationid: log.OperationID,
            type: log.Type,
          },
          create: {
            backupId: backup.id,
            logId: log.ID,
            exception: log.Exception,
            timestamp: new Date(log.Timestamp * 1000),
            message: log.Message,
            operationid: log.OperationID,
            type: log.Type,
          },
        })
        .then(() => {
          console.log(`Log ${log.ID} do backup ${id} atualizado`);
        })
        .catch((err) => {
          console.log(err.message)
          throw new Error(err.message);
        });
    }

    console.log(`Logs do backup ${id} atualizados`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error("Erro ao atualizar logs", error);
  }
};

export { updateLogs };
