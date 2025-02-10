"use server";

import { prisma } from "@/lib/prisma";

interface DeleteDeviceProps {
  id: string;
}

const deleteDevice = async ({ id }: DeleteDeviceProps) => {
  try {
    await prisma.device.delete({
      where: {
        id,
      },
    });

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export { deleteDevice };