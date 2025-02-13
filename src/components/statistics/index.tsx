import { TotalSizeTransfer } from "./total-size-transfer/total";
import { TotalSizeTransferPerDay } from "./total-size-transfer/per-day";

const StatisticsPage = () => {
  return (
    <div className="h-full w-full border rounded-md p-2 flex flex-wrap gap-2">
        <TotalSizeTransferPerDay />
        <TotalSizeTransfer />
    </div>
  );
};

export { StatisticsPage };
