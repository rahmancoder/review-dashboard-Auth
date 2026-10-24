"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { rejectSchema } from "@/lib/validations";

import { reviewSubmissionAction } from "../_actions/reviewActions";


export function ReviewActions({ id, projectName }: { id: string; projectName: string }) {
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState<string | null>(null);

    const approve = () =>
        startTransition(async () => {
            const res = await reviewSubmissionAction(id, "APPROVED");
            if (res.ok) toast.success(`“${projectName}” approved`);
            else toast.error(res.message); // e.g. "already been approved" (409) when another mentor was faster
        });


    const reject = () => {
        const parsed = rejectSchema.safeParse({ comment });
        if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid comment");
        setError(null);
        startTransition(async () => {
            const res = await reviewSubmissionAction(id, "REJECTED", parsed.data.comment);
            if (res.ok) {
                toast.success(`“${projectName}” rejected`);
                setOpen(false);
                setComment("");
            } else {
                setError(res.message);
            }
        });
    };

    return (
        <>
            <div className="flex gap-2">
                <Button size="sm" onClick={approve} disabled={pending} aria-label={`Approve ${projectName}`}>
                    {pending ? <Loader2 className="animate-spin" /> : <Check />} Approve
                </Button>

                <Button size="sm" variant="outline" onClick={() => setOpen(true)} disabled={pending} aria-label={`Reject ${projectName}`}>
                    <X /> Reject
                </Button>
            </div>

            <Dialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject “{projectName}”</DialogTitle>
                        <DialogDescription>Tell the student what to improve. This feedback is shown on their dashboard.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-1.5">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g. The live link returns a 404 - please redeploy and resubmit."
                            aria-label="Rejection reason"
                            aria-invalid={!!error}
                            rows={4}
                        />
                        {error && (
                            <p role="alert" className="text-sm text-destructive">
                                {error}
                            </p>
                        )}
                    </div>
                    <DialogFooter>

                        <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                            Cancel
                        </Button>

                        <Button variant="destructive" onClick={reject} disabled={pending}>
                            {pending && <Loader2 className="animate-spin" />} Reject project
                        </Button>

                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    );
}