"use client";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => <Sonner richColors closeButton position="top-right" {...props} />;
export { Toaster };