// src/app/(root)/layout.tsx

import type { Metadata } from "next";
import React from "react";

import NavbarClient from "@/components/shared/NavbarClient";  // client wrapper for Navbar
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
    title: "LWS Kart",
    description: "An online shop brought to you by Learn With Sumit",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavbarClient />
            <main>{children}</main>
            <Footer />
        </>
    );
}
