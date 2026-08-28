"use client";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onFilterChange: (category: string) => void;
}

export function FilterBar({ categories, activeCategory, onFilterChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2 py-8">
            <Button
                variant={activeCategory === 'All' ? 'default' : 'outline'}
                onClick={() => onFilterChange('All')}
            >
                All Packages
            </Button>
            {categories.map((cat) => (
                <Button
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    onClick={() => onFilterChange(cat)}
                    className={activeCategory === cat ? "bg-brand-orange" : ""}
                >
                    {cat}
                </Button>
            ))}
        </div>
    );
}