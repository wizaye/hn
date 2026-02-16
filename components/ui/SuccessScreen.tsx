"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface SuccessScreenProps {
    title?: string;
    message?: string;
    redirectPath?: string;
    redirectLabel?: string;
    autoRedirect?: boolean;
    redirectSeconds?: number;
}

export function SuccessScreen({
    title = "Submission Successful!",
    message = "Thank you for your enquiry. We'll get back to you shortly.",
    redirectPath = "/",
    redirectLabel = "Go to Home",
    autoRedirect = true,
    redirectSeconds = 5,
}: SuccessScreenProps) {
    const [timeLeft, setTimeLeft] = useState(redirectSeconds);

    useEffect(() => {
        if (!autoRedirect) return;

        if (timeLeft <= 0) {
            window.location.href = redirectPath;
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, autoRedirect, redirectPath]);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto min-h-[50vh]">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-3 tracking-tight"
            >
                {title}
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-8 text-lg"
            >
                {message}
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-xs space-y-4"
            >
                <Button asChild className="w-full h-12 text-base font-medium" size="lg">
                    <Link href={redirectPath}>
                        {redirectLabel} <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>

                {autoRedirect && (
                    <p className="text-sm text-muted-foreground/80">
                        Redirecting in {timeLeft} seconds...
                    </p>
                )}
            </motion.div>
        </div>
    );
}
