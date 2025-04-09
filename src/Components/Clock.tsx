// Clock.tsx
import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedTime = `${now.getDate()}, ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{time}</>;
};

export default Clock;
