"use server";

import { prisma } from "@/lib/prisma";

const getDevices = async () => {
  try {
    const devices = await prisma.device.findMany();

    return devices;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export { getDevices };