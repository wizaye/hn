"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-background">
            <div className="max-w-md w-full space-y-8 flex flex-col items-center">
                {/* 404 Display */}
                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                        Error 404
                    </span>
                    <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-foreground">
                        404
                    </h1>
                </div>

                <div className="h-px w-16 bg-foreground/20" />

                <div className="space-y-3 max-w-sm">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="pt-4">
                    <Button asChild size="lg" className="rounded-sm px-8 h-11 text-sm font-bold tracking-wide cursor-pointer">
                        <Link href="/">
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
