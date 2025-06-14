import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "LWS Kart | Authenticate yourself",
    description: "An online shop brought to you by Learn With Sumit",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <React.Fragment>{children}</React.Fragment>;
}