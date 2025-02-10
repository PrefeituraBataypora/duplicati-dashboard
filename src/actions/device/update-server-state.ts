"use server";

import { prisma } from "@/lib/prisma";
import { ServerState } from "@/types/server-state";

interface UpdateDeviceServerStateProps {
  device: {
    ip: string;
  };
  serverState: ServerState;
}

const updateDeviceServerState = async ({
  device,
  serverState,
}: UpdateDeviceServerStateProps) => {
  try {
    console.log(
      `Atualizando/criando estado do servidor para o dispositivo ${device.ip}`
    );
    const deviceInfo = await prisma.device.findFirstOrThrow({
      where: {
        ip: device.ip,
      },
    });

    await prisma.serverState.upsert({
      where: {
        deviceId: deviceInfo.id,
      },
      update: {
        ProgramState: serverState.ProgramState,
        ProposedSchedule: serverState.ProposedSchedule,
      },
      create: {
        deviceId: deviceInfo.id,
        ProgramState: serverState.ProgramState,
        ProposedSchedule: serverState.ProposedSchedule,
      },
    });

    console.log(
      `Estado do servidor do dispositivo ${deviceInfo.ip} atualizado/criado`
    );
  } catch (error) {
    console.error("Erro ao atualizar/criar o estado do servidor", error);
  }
};

export { updateDeviceServerState };
