"use server";

import { prisma } from "@/lib/prisma";
import { Backups } from "@/types/backups";

interface UpdateDeviceBackupInfoProps {
  device: {
    ip: string;
  };
  backupInfo: Backups[];
}

const updateDeviceBackupInfo = async ({
  device,
  backupInfo,
}: UpdateDeviceBackupInfoProps) => {
  try {
    const deviceInfo = await prisma.device.findFirstOrThrow({
      where: {
        ip: device.ip,
      },
    });

    for (const { Backup, Schedule } of backupInfo) {
      const deviceBackupInfo = await prisma.backup.upsert({
        where: {
          duplicatiId: Backup.ID, // Garantindo que o critério de busca seja um identificador único
        },
        update: {
          description: Backup.Description,
          metadata: Backup.Metadata,
          targetUrl: Backup.TargetURL,
        },
        create: {
          deviceId: deviceInfo.id,
          duplicatiId: Backup.ID,
          description: Backup.Description,
          metadata: Backup.Metadata,
          targetUrl: Backup.TargetURL,
        },
      });

      console.log(`Backup do dispositivo ${deviceInfo.ip} atualizado/criado`);

      await prisma.schedule.upsert({
        where: {
          backupId: deviceBackupInfo.id, // Garante que o agendamento é vinculado ao backup correto
        },
        update: {
          lastRun: Schedule.LastRun,
          repeat: Schedule.Repeat,
          time: Schedule.Time,
          allowedDays: Schedule.AllowedDays,
        },
        create: {
          lastRun: Schedule.LastRun,
          repeat: Schedule.Repeat,
          time: Schedule.Time,
          allowedDays: Schedule.AllowedDays,
          backupId: deviceBackupInfo.id,
        },
      });

      console.log(`Agendamento para backup ${deviceInfo.ip} atualizado/criado`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro ao atualizar backup:", error);
    throw new Error(error.message || "Erro desconhecido");
  }
};

export { updateDeviceBackupInfo };
