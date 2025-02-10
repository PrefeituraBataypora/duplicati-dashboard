"use server";

import { prisma } from "@/lib/prisma";

interface UpdateDeviceInfoProps {
  device: {
    ip: string;
    alias?: string;
    state: string;
    lastCheck: Date;
    lastSync?: Date;
  };
}

const updateDeviceInfo = async ({ device }: UpdateDeviceInfoProps) => {
  const { ip, alias, state, lastCheck, lastSync } = device;
  try {
    console.log(`Atualizando status do dispositivo ${ip}`);
    console.log(`Status: ${state}`);
    const device = await prisma.device.findFirstOrThrow({
      where: {
        ip,
      },
    });

    await prisma.device.update({
      where: {
        id: device.id,
      },
      data: {
        alias,
        state,
        lastCheck,
        lastSync,
      },
    });

    console.log(`Status do dispositivo ${ip} atualizado`);

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export { updateDeviceInfo };
