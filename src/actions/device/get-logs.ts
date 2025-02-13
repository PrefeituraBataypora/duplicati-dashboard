"use server";

import { prisma } from "@/lib/prisma";

interface GetLogsProps {
  backupId: string;
}

const getLogs = async ({ backupId }: GetLogsProps) => {
  try {
    const backup = await prisma.backup.findFirstOrThrow({
      where: {
        id: backupId,
      },
      include: {
        logs: true,
      },
    });

    if (backup.logs.length === 0) {
      return "Nenhum log encontrado";
    }

    return { logs: backup.logs };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Erro ao buscar logs do backup ${backupId}`, error);
  }
};

export { getLogs };
