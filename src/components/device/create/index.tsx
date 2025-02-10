"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createDevice } from "@/actions/device/create";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const createDeviceSchema = z.object({
  ip: z.string().ip({ version: "v4", message: "Necessita ser um IP válido" }),
  port: z
    .number()
    .int()
    .min(3000, { message: "Porta deve ser maior que 3000" })
    .max(65535, { message: "Porta deve ser menor que 65535" }),
});

type CreateDeviceForm = z.infer<typeof createDeviceSchema>;

const CreateDevice = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeviceForm>({
    resolver: zodResolver(createDeviceSchema),
  });

  const handleCreateDevice = async ({ ip, port }: CreateDeviceForm) => {
    setIsSubmitting(true);

    await createDevice({ ip, port })
      .then(() => {
        toast.success("Dispositivo criado com sucesso");
        queryClient.invalidateQueries({ queryKey: ["devices"] });
        setIsOpen(false);
      })
      .catch(() => {
        toast.error("Erro ao criar dispositivo");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus />
          Criar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar dispositivo</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateDevice)}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2">
            <Label>IP</Label>
            <Input
              disabled={isSubmitting}
              placeholder="Digite o IP do dispositivo"
              type="text"
              {...register("ip")}
            />
            {errors.ip && (
              <span className="text-red-500">{errors.ip.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Porta</Label>
            <Input
              disabled={isSubmitting}
              placeholder="Digite a porta do dispositivo"
              type="text"
              {...register("port")}
            />
            {errors.ip && (
              <span className="text-red-500">{errors.ip.message}</span>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateDevice };
