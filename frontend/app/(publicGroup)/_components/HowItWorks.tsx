import { ClipboardCheck, Send, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { Icon: UserPlus, title: "1. Sign up", text: "Create a free student account in seconds." },
  { Icon: Send, title: "2. Submit", text: "Share your repo, live link and a short description." },
  { Icon: ClipboardCheck, title: "3. Get feedback", text: "A mentor approves it or tells you what to improve." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-3">
      {steps.map(({ Icon, title, text }) => (
        <Card key={title}>

          <CardHeader>
            <Icon className="size-6 text-primary" aria-hidden />
            <CardTitle>{title}</CardTitle>

          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
        </Card>

      ))}
    </section>
  );
}
