import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionForm } from "../../_components/SubmissionForm";

export const metadata: Metadata = { title: "Submit project" };

export default function SubmitPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Submit a project</CardTitle>
                    <CardDescription>Each repository can only be submitted once. You can send up to 5 submissions every 10 minutes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SubmissionForm />
                </CardContent>
            </Card>
        </div>
    );
}