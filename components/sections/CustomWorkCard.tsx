"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";

interface CustomWorkCardProps {
    title: string;
    description: string;
    image?: string;
}

export function CustomWorkCard({ title, description, image }: CustomWorkCardProps) {
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className="group/card border border-foreground/10 hover:border-foreground transition-colors flex flex-col p-2 sm:p-3 h-full bg-background rounded-sm">
            {/* Image Section */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogTrigger asChild>
                    <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden bg-muted/30 cursor-pointer">
                        {image && !imageError ? (
                            <>
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500"
                                    onError={() => setImageError(true)}
                                />

                                {/* Hover Overlay with Zoom Hint */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-background/90 text-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-foreground/10 shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3" /><path d="M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6" /></svg>
                                        Enlarge
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                <span className="text-4xl opacity-20">🎨</span>
                            </div>
                        )}
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[90vw] p-4 rounded-none bg-background">
                    <DialogTitle className="sr-only">{title}</DialogTitle>
                    <div className="relative w-full aspect-square bg-muted/20">
                        {image && !imageError && (
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-contain p-8"
                            />
                        )}
                    </div>
                    <div className="text-center mt-4">
                        <h3 className="text-2xl font-bold italic">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">{description}</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Info Section */}
            <div className="flex flex-col flex-1 gap-1">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold italic line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[10px] sm:text-xs text-muted-foreground/80 line-clamp-3 mt-1">
                    {description}
                </p>
            </div>
        </div>
    );
}
