"use client";

import { useEffect, useRef } from "react";
import { AlarmClockIcon, AlarmClockIconHandle } from "@/components/ui/alarm-clock";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

function Spinner({ className, size = 28, ...props }: SpinnerProps) {
  const iconRef = useRef<AlarmClockIconHandle>(null);

  useEffect(() => {
    iconRef.current?.startAnimation();
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-flex", className)}
      {...props}
    >
      <AlarmClockIcon ref={iconRef} size={size} />
    </div>
  );
}

export { Spinner };
