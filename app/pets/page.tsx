import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PetCard from "@/components/PetCard";
import Link from "next/link";
import { Plus } from "lucide-react";
import SearchPets from "@/components/SearchPets";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Props odbierają parametry z URL (np. ?query=burek&species=pies)
export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; species?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  // Pobieramy paramsy (w Next 15 to Promise)
  const params = await searchParams;
  const query = params.query || "";
  const species = params.species || "";

  // Pobieramy rolę
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });
  const currentRole = user?.role || "owner";

  // --- BUDOWANIE ZAPYTANIA (Data Engineering Style) ---
  // Zamiast if-else, budujemy obiekt where dynamicznie.

  const whereClause: Prisma.PetWhereInput = {
    AND: [
      // 1. Filtr bezpieczeństwa (kto co widzi)
      currentRole === "owner" ? { ownerId: session.userId } : {},

      // 2. Wyszukiwanie po imieniu (insensitive = ignoruj wielkość liter)
      query ? { name: { contains: query } } : {}, // Usunąłem mode: 'insensitive' bo SQLite tego nie wspiera natywnie w Prismie (chyba że masz Postgres), ale SQLite domyślnie jest case-insensitive dla LIKE.

      // 3. Filtr po gatunku
      species ? { species: species } : {},
    ],
  };

  // Wykonanie zapytania z filtrami
  const pets = await db.pet.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: { name: true, lastName: true, email: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Nagłówek */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacjenci</h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                ["admin", "vet"].includes(currentRole)
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {currentRole.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              • Wyników: {pets.length}
            </span>
          </div>
        </div>

        <Link
          href="/pets/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Dodaj zwierzaka
        </Link>
      </div>

      {/* --- TUTAJ WSTAWIAMY FILTRY --- */}
      <SearchPets />

      {/* Lista Kart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {/* Pusty stan */}
      {pets.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
            <Plus className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Brak wyników</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            {query || species
              ? "Nie znaleziono pacjentów pasujących do filtrów."
              : "Baza danych jest pusta."}
          </p>
        </div>
      )}
    </div>
  );
}
