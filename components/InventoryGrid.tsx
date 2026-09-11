'use client';

import { useState } from "react";
import { INVENTORY } from "@/data/inventory";
import { InventoryCard } from "./InventoryCard";

export const InventoryGrid = () => {
  const [filter, setFilter] = useState("all");

  const categories = ["all", "safari", "lodge"]; // Extensible list
  
  const filteredItems = filter === "all" 
    ? INVENTORY 
    : INVENTORY.filter(item => item.slug.includes(filter));

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full capitalize ${filter === cat ? 'bg-brand-orange text-white' : 'bg-slate-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};