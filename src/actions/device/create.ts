"use server";

import { prisma } from "@/lib/prisma";

interface CreateDeviceInput {
  ip: string;
  port: number;
}

const createDevice = async ({ ip, port }: CreateDeviceInput) => {
  try {
    await prisma.device.create({
      data: {
        ip,
        port,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export { createDevice };