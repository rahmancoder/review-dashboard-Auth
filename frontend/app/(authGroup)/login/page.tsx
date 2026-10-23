import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { safeNext } from "@/lib/utils";

import { LoginForm } from "../_components/LoginForm";


export const metadata: Metadata = { title: "Log in" };


export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await searchParams;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Log in as a student or mentor.</CardDescription>

            </CardHeader>

            <CardContent>
                <LoginForm next={safeNext(next) ?? undefined} />
            </CardContent>

        </Card>
    );
}