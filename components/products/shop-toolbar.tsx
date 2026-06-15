"use client";

interface ShopToolbarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ShopToolbar({ sortBy, onSortChange }: ShopToolbarProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSortChange(value);
  };

  return (
    <div className="flex w-full min-w-0 items-center justify-end sm:w-auto">
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="h-12 w-full min-w-0 cursor-pointer rounded-full border border-[#DDE3EC] bg-[#F8FAFC] px-4 py-2 text-[15px] font-medium text-[#111827] shadow-[0_2px_10px_rgba(15,23,42,0.04)] focus:border-blue-500 focus:outline-none md:h-11 md:bg-white md:text-sm md:shadow-none sm:w-auto"
      >
        <option value="featured">Popular</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
