"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormField } from "@/components/shared/form-field";

import { registerSchema, type RegisterValues } from "@/lib/validations";

import { applyServerErrors } from "@/lib/formErrors";
import { registerAction } from "../_actions/authActions";

export function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });
  const { register, formState } = form;
  const e = formState.errors;

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const res = await registerAction(values);
      if (res && !res.ok) setFormError(applyServerErrors(form, res));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}
      <FormField id="name" label="Full name" error={e.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!e.name} {...register("name")} />
      </FormField>
      <FormField id="email" label="Email" error={e.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!e.email} {...register("email")} />
      </FormField>
      <FormField id="password" label="Password" error={e.password?.message} hint="8+ characters with upper, lower case and a number">
        <Input id="password" type="password" autoComplete="new-password" aria-invalid={!!e.password} {...register("password")} />
      </FormField>
      <FormField id="confirmPassword" label="Confirm password" error={e.confirmPassword?.message}>
        <Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={!!e.confirmPassword} {...register("confirmPassword")} />
      </FormField>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} {pending ? "Creating account…" : "Create student account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}

        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>

      </p>
    </form>
  );
}
