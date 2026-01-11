import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import GlobalVisitsList from "@/components/VisitsList";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  // 1. Pobieramy rolę
  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase() || "guest";
  const isStaff = role === "admin" || role === "vet";

  // 2. Budujemy zapytanie (WHERE)
  // Jeśli to Owner -> pokaż wizyty JEGO zwierzaków.
  // Jeśli to Vet -> pokaż WSZYSTKIE.
  const whereClause = isStaff
    ? {} // Pusty obiekt = brak filtrów = wszystko
    : { pet: { ownerId: session.userId } }; // Filtr dla właściciela

  // 3. Pobieramy dane
  const visits = await db.visit.findMany({
    where: whereClause,
    orderBy: { date: "desc" }, // Najnowsze na górze
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          owner: { select: { name: true, lastName: true } }, // Pobieramy dane właściciela dla Veta
        },
      },
      vet: {
        select: { name: true, lastName: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Nagłówek */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <CalendarDays className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terminarz Wizyt</h1>
        </div>
      </div>

      {/* Lista */}
      <GlobalVisitsList visits={visits} userRole={role} />
    </div>
  );
}
