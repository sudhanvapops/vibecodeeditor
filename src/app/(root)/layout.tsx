import { cn } from "@/lib/utils";
import Footer from "@/modules/home/components/footer";
import Header from "@/modules/home/components/header";
import { Metadata } from "next";
import React from "react";
import Home from "./page";


export const metadata: Metadata = {
    title: {
        template: "VibeCode - Editor",
        default: "VibeCode Editor"
    },
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Header */}
            <Header />

            <main className="z-20 relative w-full pt-0 overflow-hidden">
                {children}
            </main>

            
            {/* Footer */}
            <Footer />
        </>
    )
}