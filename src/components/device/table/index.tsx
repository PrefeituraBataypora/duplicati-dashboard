import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DeviceTableItemProps {
  children: React.ReactNode;
}

const DevicesTable = ({ children }: DeviceTableItemProps) => {
  return (
    <div className="border rounded-md">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP</TableHead>
          <TableHead>Alias</TableHead>
          <TableHead>Próximo Backup</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Última atualização</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
    </div>
  );
};

export { DevicesTable };
