"use server";

import { prisma } from "@/lib/prisma";

interface GetDeviceInfoProps {
  id: string;
}

const getDeviceInfo = async ({ id }: GetDeviceInfoProps) => {
  try {
    const device = await prisma.device.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        backups: {
          include: {
            schedule: true
          }
        },
        systemInfo: true,
        serverState: true,
      },
    });

    return device;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export { getDeviceInfo };
