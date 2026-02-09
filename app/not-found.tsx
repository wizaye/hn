"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-background">
            <div className="max-w-xl w-full space-y-8 flex flex-col items-center">

                {/* Horizontal 404 Alignment */}
                <div className="flex items-center justify-center gap-4 text-foreground/90 pb-4">
                    <span className="text-[8rem] sm:text-[10rem] font-serif font-black leading-none tracking-tighter">4</span>

                    {/* Static Clock Icon acting as the '0' */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[6px] sm:border-[8px] border-foreground/90 flex items-center justify-center relative bg-background">
                        <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-foreground/90 stroke-[2.5]" />
                    </div>

                    <span className="text-[8rem] sm:text-[10rem] font-serif font-black leading-none tracking-tighter">4</span>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Time seems to have slipped away...
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        We couldn't find the page you're looking for. It might have been moved or doesn't exist in this timeline.
                    </p>
                </div>

                <div className="pt-6">
                    <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all">
                        <Link href="/">
                            Return to Present
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
