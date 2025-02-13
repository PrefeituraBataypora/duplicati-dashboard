"use client";

import { useEffect, useState } from "react";
import { dayjs } from "@/lib/dayjs";
import { Button } from "../ui/button";

const Hour = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  });

  return <Button variant="secondary">{dayjs(time).format("HH:mm:ss")}</Button>;
};

export { Hour };
