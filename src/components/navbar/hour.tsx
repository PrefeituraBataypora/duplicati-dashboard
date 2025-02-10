"use client";

import { useEffect, useState } from "react";
import { dayjs } from "@/lib/dayjs";

const Hour = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  });

  return <p>{dayjs(time).format("HH:mm:ss")}</p>;
};

export { Hour };