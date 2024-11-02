import { useEffect, useState } from "react";

export function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background fixed inset-0 flex items-center justify-center">
      <div className="text-foreground text-4xl font-bold">
        Loading
        <span className="inline-block w-16 text-left">{dots}</span>
      </div>
    </div>
  );
}
