"use client";

import { deleteDevice } from "@/actions/device/delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteDeviceProps {
  id: string;
  ip: string;
}

const DeleteDevice = ({ id, ip }: DeleteDeviceProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteDevice({ id });
      toast.success("Dispositivo excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao excluir o dispositivo");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja realmente excluir o dispositivo {ip} ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteDevice };
