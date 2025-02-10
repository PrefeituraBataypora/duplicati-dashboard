"use server";

import { prisma } from "@/lib/prisma";
import { SystemInfo } from "@/types/system-info";

interface UpdateDeviceSystemInfoProps {
  device: {
    ip: string;
  };
  systemInfo: SystemInfo;
}

const updateDeviceSystemInfo = async ({
  device,
  systemInfo,
}: UpdateDeviceSystemInfoProps) => {
  try {
    console.log(
      `Atualizando informações do sistema do dispositivo ${device.ip}`
    );

    const deviceInfo = await prisma.device.findFirstOrThrow({
      where: {
        ip: device.ip,
      },
    });

    await prisma.systemInfo.upsert({
      where: {
        deviceId: deviceInfo.id,
      },
      update: {
        MachineName: systemInfo.MachineName,
        OSType: systemInfo.OSType,
        OSVersion: systemInfo.OSVersion || "Sem versão de OS",
        UserName: systemInfo.UserName.split("\\")[1],
      },
      create: {
        deviceId: deviceInfo.id,
        MachineName: systemInfo.MachineName,
        OSType: systemInfo.OSType,
        OSVersion: systemInfo.OSVersion || "Sem versão de OS",
        UserName: systemInfo.UserName.split("\\")[1],
      },
    });

    console.log(
      `Informações do sistema do dispositivo ${deviceInfo.ip} atualizadas/criadas`
    );
  } catch (error) {
    console.error("Erro ao atualizar/criar informações do sistema", error);
  }
};

export { updateDeviceSystemInfo };
