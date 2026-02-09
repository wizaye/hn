"use client";

import { useState } from "react";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getCategoryDisplayName } from "@/lib/product-helpers";

// Price range options
const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
    { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
    { label: "Above ₹5,000", min: 5000, max: Infinity },
];

export interface FilterState {
    categories: string[];
    priceRange: { min: number; max: number } | null;
}

interface FilterSidebarProps {
    categories: string[];
    selectedFilters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    productCount: number;
    showHeader?: boolean;
}

// Filter content component (shared between desktop and mobile)
function FilterContent({
    categories,
    selectedFilters,
    onFilterChange,
    productCount,
    showHeader = true,
}: FilterSidebarProps & { showHeader?: boolean }) {
    const [categoryOpen, setCategoryOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const activeFilterCount =
        selectedFilters.categories.length +
        (selectedFilters.priceRange ? 1 : 0);

    const handleCategoryToggle = (category: string) => {
        const newCategories = selectedFilters.categories.includes(category)
            ? selectedFilters.categories.filter((c) => c !== category)
            : [...selectedFilters.categories, category];
        onFilterChange({ ...selectedFilters, categories: newCategories });
    };

    const handlePriceApply = () => {
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        if (min >= 0 && (max === Infinity || max >= min)) {
            onFilterChange({
                ...selectedFilters,
                priceRange: { min, max },
            });
        }
    };

    const handlePriceClear = () => {
        setMinPrice('');
        setMaxPrice('');
        onFilterChange({ ...selectedFilters, priceRange: null });
    };

    const clearAllFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        onFilterChange({ categories: [], priceRange: null });
    };

    return (
        <div className="flex flex-col">
            {/* Header - only show on desktop */}
            {showHeader && (
                <div className="mb-8">
                    <h2 className="font-serif text-2xl italic mb-6">Filters</h2>
                    <div className="h-px bg-foreground w-full" />
                </div>
            )}

            {/* Categories */}
            <div className="mb-4">
                <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Categories</h3>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                categoryOpen && "rotate-180"
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-2">
                        {categories.map((category) => (
                            <label
                                key={category}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <Checkbox
                                    checked={selectedFilters.categories.includes(category)}
                                    onCheckedChange={() => handleCategoryToggle(category)}
                                    className="rounded-none border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                                />
                                <span className="text-sm font-medium uppercase tracking-tight group-hover:underline">
                                    {getCategoryDisplayName(category)}
                                </span>
                            </label>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Price Range */}
            <div className="mb-4">
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Price Range</h3>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                priceOpen && "rotate-180"
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase text-foreground/60 mb-1 block">Min ₹</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-foreground/30 px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-foreground"
                                />
                            </div>
                            <span className="text-foreground/40 mt-5">—</span>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase text-foreground/60 mb-1 block">Max ₹</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Any"
                                    className="w-full border border-foreground/30 px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-foreground"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePriceApply}
                                className="flex-1 bg-foreground text-background py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-foreground/90 transition-colors"
                            >
                                Apply
                            </button>
                            {selectedFilters.priceRange && (
                                <button
                                    onClick={handlePriceClear}
                                    className="px-4 border border-foreground/30 text-[10px] font-bold uppercase tracking-wide hover:bg-foreground/10 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {selectedFilters.priceRange && (
                            <p className="text-[10px] text-foreground/60">
                                Active: ₹{selectedFilters.priceRange.min} — {selectedFilters.priceRange.max === Infinity ? 'Any' : `₹${selectedFilters.priceRange.max}`}
                            </p>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="w-full border border-foreground py-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
}

// Desktop sidebar
export function FilterSidebarDesktop(props: FilterSidebarProps) {
    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
                <FilterContent {...props} />
            </div>
        </aside>
    );
}

// Mobile filter trigger and drawer (bottom sheet)
export function FilterSidebarMobile(props: FilterSidebarProps) {
    const [open, setOpen] = useState(false);
    const activeFilterCount =
        props.selectedFilters.categories.length +
        (props.selectedFilters.priceRange ? 1 : 0);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 border border-foreground/30 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-foreground text-background text-[9px] px-1.5 py-0.5 ml-1">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </DrawerTrigger>
            <DrawerContent className="h-[75vh] flex flex-col p-0 rounded-t-2xl">
                <DrawerHeader className="border-b px-5 py-4">
                    <DrawerTitle className="font-serif text-xl italic">Filters</DrawerTitle>
                    <DrawerDescription className="text-xs text-foreground/60">
                        Narrow down products by category or price
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <FilterContent {...props} showHeader={false} />
                </div>

                <div className="border-t px-5 py-4 bg-background">
                    <DrawerClose asChild>
                        <button className="w-full bg-foreground text-background py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                            Show {props.productCount} Results
                        </button>
                    </DrawerClose>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

// Combined export for convenience
export function FilterSidebar(props: FilterSidebarProps) {
    return (
        <>
            <FilterSidebarDesktop {...props} />
            <FilterSidebarMobile {...props} />
        </>
    );
}
