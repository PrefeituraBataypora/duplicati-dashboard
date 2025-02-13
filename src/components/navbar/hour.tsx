"use client";

import { useEffect, useState } from "react";
import { dayjs } from "@/lib/dayjs";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";

const Hour = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <Button variant="secondary" className="flex items-center gap-2">
      <Clock />
      {dayjs(time).format("HH:mm:ss")}
    </Button>
  );
};

export { Hour };
