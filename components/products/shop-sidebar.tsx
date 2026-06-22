"use client";

import { useEffect, useState } from "react";
import { buildCategoryTree, fetchCategories as loadCategories } from "@/services/category-service";
import type { Category } from "@/types/category";


interface ShopSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number;
  onPriceChange: (price: number) => void;
}

export default function ShopSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: ShopSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        setCategories(await loadCategories());
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryOptions();
  }, []);

  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-8 h-fit lg:sticky lg:top-6">

      <div>
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">
          Category
        </h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:block lg:space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading categories...</p>
          ) : (
            <>
              <button onClick={() => onCategoryChange("all")}
                className={`block min-h-11 text-left w-full rounded-xl px-3 py-2 text-sm font-medium transition lg:min-h-0 lg:rounded-none lg:px-0 lg:py-0 ${
                  selectedCategory === "all"
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                All products
              </button>
              {categoryTree.map((category) => (
                <div key={category.id}>
                  <button onClick={() => onCategoryChange(category.slug)} className={`block min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition lg:min-h-0 lg:rounded-none lg:px-0 lg:py-0 ${selectedCategory === category.slug ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`}>{category.name}</button>
                  {category.children.map((child) => (
                    <button key={child.id} onClick={() => onCategoryChange(child.slug)} className={`block min-h-11 w-full rounded-xl px-6 py-2 text-left text-sm transition lg:min-h-0 lg:rounded-none lg:py-1.5 ${selectedCategory === child.slug ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}>{child.name}</button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">
          Price range
        </h3>

        <input
          type="range"
          min="0"
          max="100000"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <p className="mt-3 text-sm text-slate-600">
          ₹0 - ₹{priceRange.toLocaleString()}
        </p>
      </div>

    </div>
  );
}
