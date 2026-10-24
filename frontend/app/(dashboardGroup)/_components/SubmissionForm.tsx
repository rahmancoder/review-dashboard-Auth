"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormField } from "@/components/shared/form-field";


import { submissionSchema, type SubmissionValues } from "@/lib/validations";
import { applyServerErrors } from "@/lib/formErrors";


import { createSubmissionAction } from "../_actions/submissionActions";



export function SubmissionForm() {

    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<SubmissionValues>({
        resolver: zodResolver(submissionSchema),
        defaultValues: { projectName: "", repoUrl: "", liveUrl: "", description: "" },
        mode: "onTouched",
    });


    const { register, formState, watch } = form;
    const e = formState.errors;
    const descLength = watch("description").length;


    const onSubmit = form.handleSubmit((values) => {

        if (pending) return; // belt and braces against double-clicks (button is also disabled)

        setFormError(null);

        startTransition(async () => {

            const res = await createSubmissionAction(values);

            if (res.ok) {
                toast.success("Project submitted - a mentor will review it soon.");
                form.reset();
                router.push("/dashboard/my-submissions");
                return;
            }

            const banner = applyServerErrors(form, res); // duplicate repo => error under the Repo URL input

            if (banner) {
                setFormError(banner);
                toast.error(banner); // e.g. rate limit (429) or network error
            }
        });
    });

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            {formError && (

                <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError}
                </div>

            )}
            <FormField id="projectName" label="Project name" error={e.projectName?.message}>
                <Input id="projectName" placeholder="Awesome Task Manager" aria-invalid={!!e.projectName} {...register("projectName")} />
            </FormField>

            <FormField id="repoUrl" label="Repository URL" error={e.repoUrl?.message} hint="GitHub, GitLab or Bitbucket - e.g. https://github.com/you/project">
                <Input id="repoUrl" inputMode="url" placeholder="https://github.com/you/project" aria-invalid={!!e.repoUrl} {...register("repoUrl")} />
            </FormField>

            <FormField id="liveUrl" label="Live link" error={e.liveUrl?.message}>
                <Input id="liveUrl" inputMode="url" placeholder="https://your-project.vercel.app" aria-invalid={!!e.liveUrl} {...register("liveUrl")} />
            </FormField>

            <FormField id="description" label="Description" error={e.description?.message} hint={`${descLength}/1000 - what it does, tech used, what you're proud of`}>
                <Textarea id="description" rows={5} aria-invalid={!!e.description} {...register("description")} />
            </FormField>


            <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="animate-spin" />} {pending ? "Submitting…" : "Submit project"}
            </Button>

        </form>
    );
}