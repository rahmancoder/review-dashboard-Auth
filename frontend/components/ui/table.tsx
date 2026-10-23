import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}
const TableHeader = ({ className, ...p }: React.ComponentProps<"thead">) => <thead className={cn("[&_tr]:border-b", className)} {...p} />;
const TableBody = ({ className, ...p }: React.ComponentProps<"tbody">) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...p} />;
const TableRow = ({ className, ...p }: React.ComponentProps<"tr">) => (
  <tr className={cn("border-b transition-colors hover:bg-muted/50", className)} {...p} />
);
const TableHead = ({ className, ...p }: React.ComponentProps<"th">) => (
  <th className={cn("h-10 px-3 text-left align-middle text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase", className)} {...p} />
);
const TableCell = ({ className, ...p }: React.ComponentProps<"td">) => <td className={cn("px-3 py-3 align-top", className)} {...p} />;

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
