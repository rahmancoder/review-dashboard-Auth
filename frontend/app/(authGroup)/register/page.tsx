import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "../_components/RegisterForm";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <Card>

      <CardHeader>
        <CardTitle className="text-xl">Create your student account</CardTitle>
        <CardDescription>Mentor accounts are created by an administrator.</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />
      </CardContent>

    </Card>
  );
}
