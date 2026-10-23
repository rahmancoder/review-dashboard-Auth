import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/lib/types";

const config = {
  PENDING: { label: "Pending", variant: "warning", Icon: Clock },
  APPROVED: { label: "Approved", variant: "success", Icon: CheckCircle2 },
  REJECTED: { label: "Rejected", variant: "destructive", Icon: XCircle },
} as const;

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, variant, Icon } = config[status];
  return (
    <Badge variant={variant}>
      <Icon aria-hidden /> {label}
    </Badge>
  );
}
