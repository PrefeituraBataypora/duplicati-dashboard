"use server";

import { dayjs } from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";

const getTotalBackupsSize = async () => {
  try {
    console.log("Obtendo o tamanho total dos backups");
    const logs = await prisma.backupLog.findMany();

    if (!logs) {
      return 0;
    }

    if (logs.length === 0) {
      return 0;
    }

    const today = dayjs().toDate();
    const last30days = dayjs().subtract(30, "days").toDate();
    let total = 0;
    let totalAdded = 0;
    let totalModified = 0;

    const totalSize = logs
      .filter((log) => {
        const message = JSON.parse(log.message);
        const logDate = new Date(message.EndTime);

        return logDate > last30days && logDate < today;
      })
      .reduce((acc, log) => {
        const message = JSON.parse(log.message);
        const total = (message.SizeOfModifiedFiles || 0) + (message.SizeOfAddedFiles || 0)
        totalAdded += message.SizeOfAddedFiles || 0;
        totalModified += message.SizeOfModifiedFiles || 0;
        return acc + total;
      }, 0);

      total += totalSize;
      console.log(`Tamanho total dos backups: ${totalSize}`);

    return { total, totalAdded, totalModified };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Erro ao obter o tamanho total dos backups: ${error.message}`);
    throw new Error(
      `Erro ao obter o tamanho total dos backups: ${error.message}`
    );
  }
};

export { getTotalBackupsSize };
