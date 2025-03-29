import * as React from "react";
import { cn } from "@/lib/utils";

const Chart = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("w-full", className)} ref={ref} {...props} />;
});
Chart.displayName = "Chart";

const ChartContainer = React.forwardRef(
  ({ className, tooltip, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)} ref={ref} {...props}>
        {tooltip}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = ({ children }) => {
  return (
    <div className="absolute z-10 rounded-md border bg-popover p-2 shadow-md">
      {children}
    </div>
  );
};
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col space-y-1", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartTooltipItem = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">
        {typeof value === "function" ? value({}) : value}
      </span>
    </div>
  );
};
ChartTooltipItem.displayName = "ChartTooltipItem";

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
};
