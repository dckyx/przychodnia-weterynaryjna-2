"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";

export default function SearchPets() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentQuery = searchParams.get("query")?.toString() || "";
  const currentSpecies = searchParams.get("species")?.toString() || "";
  const hasFilters = currentQuery || currentSpecies;

  const handleSearch = (term: string, type: "query" | "species") => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set(type, term);
    else params.delete(type);
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => replace(pathname);

  return (
    // Zwiększyłem padding kontenera (p-2) i zaokrąglenie (rounded-2xl)
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 p-2 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* 1. WYSZUKIWARKA */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {/* Nieco większa ikona i większy odstęp */}
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            // Zwiększyłem padding pionowy (py-3) i lewy (pl-12)
            className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-base focus:ring-0 placeholder:text-gray-400 text-gray-900"
            placeholder="Szukaj pacjenta..."
            defaultValue={currentQuery}
            onChange={(e) => handleSearch(e.target.value, "query")}
          />
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px bg-gray-200 my-2"></div>

        {/* 2. FILTR GATUNKU */}
        <div className="relative sm:w-56 group border-t sm:border-t-0 border-gray-100 sm:border-none">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <select
            // Tutaj też luźniej (py-3)
            className="block w-full pl-12 pr-10 py-3 bg-transparent border-none text-base focus:ring-0 cursor-pointer text-gray-700 appearance-none"
            value={currentSpecies}
            onChange={(e) => handleSearch(e.target.value, "species")}
          >
            <option value="">Wszystkie</option>
            <option value="pies">Pies</option>
            <option value="kot">Kot</option>
            <option value="inne">Inne</option>
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400"></div>
        </div>
      </div>
    </div>
  );
}
