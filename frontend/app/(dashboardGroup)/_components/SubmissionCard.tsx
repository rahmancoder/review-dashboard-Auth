import { ExternalLink, GitBranch, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";

import { formatDate } from "@/lib/utils";

import type { Submission } from "@/lib/types";



export function SubmissionCard({ submission: s }: { submission: Submission }) {


    const feedback = s.feedbacks[0];

    return (
        <Card>
            <CardHeader>

                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base">{s.projectName}</CardTitle>
                    <StatusBadge status={s.status} />
                </div>


                <p className="text-xs text-muted-foreground">Submitted {formatDate(s.createdAt)}</p>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                    <a href={s.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                        <GitBranch className="size-4" /> Repository
                    </a>

                    <a href={s.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                        <ExternalLink className="size-4" /> Live site
                    </a>

                </div>

                {feedback && (
                    <div className="flex gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                        <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />

                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Feedback from {feedback.mentor.name}</p>
                            <p>{feedback.comment ?? (feedback.decision === "APPROVED" ? "Approved - nice work!" : "No comment provided.")}</p>
                        </div>

                    </div>
                )}
            </CardContent>
        </Card>
    );
}