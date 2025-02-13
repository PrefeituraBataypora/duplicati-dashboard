"use server";

import { dayjs } from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";

const getTotalBackupsSizePerDay = async () => {
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

    const totalSizePerDayFormatted: {
      date: string;
      totalModified: number;
      totalAdded: number;
    }[] = logs
      .filter((log) => {
        const message = JSON.parse(log.message);
        const logDate = new Date(message.EndTime);
        return logDate > last30days && logDate < today;
      })
      .reduce<{ date: string; totalModified: number; totalAdded: number }[]>(
        (acc, log) => {
          const message = JSON.parse(log.message);
          const totalModified = message.SizeOfModifiedFiles || 0;
          const totalAdded = message.SizeOfAddedFiles || 0;
          const logDate = new Date(message.EndTime);
          const logDay = dayjs(logDate).format("YYYY-MM-DD");

          // Acumula os totais por dia
          const existing = acc.find((entry) => entry.date === logDay);
          if (existing) {
            existing.totalModified += totalModified;
            existing.totalAdded += totalAdded;
          } else {
            acc.push({ date: logDay, totalModified, totalAdded });
          }

          return acc;
        },
        []
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalSizePerDay: totalSizePerDayFormatted,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `Erro ao obter o tamanho total dos backups por dia: ${error.message}`
    );
    throw new Error(
      `Erro ao obter o tamanho total dos backups por dia: ${error.message}`
    );
  }
};

export { getTotalBackupsSizePerDay };
