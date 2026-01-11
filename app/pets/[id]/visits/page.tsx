import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VisitSection from "@/components/VisitSection"; // Upewnij się, że masz ten komponent z poprzednich kroków

interface VisitsPageProps {
  params: Promise<{ id: string }>;
}

// Wyłączamy cache, żeby zawsze widzieć świeże wizyty
export const dynamic = "force-dynamic";

export default async function PetVisitsPage({ params }: VisitsPageProps) {
  // 1. Sprawdzamy sesję
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  const resolvedParams = await params;
  const petId = resolvedParams.id;

  const pet = await db.pet.findUnique({
    where: { id: petId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!pet) return notFound();

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase() || "guest";
  const isStaff = role === "admin" || role === "vet";

  if (!isStaff && pet.ownerId !== session.userId) {
    return notFound();
  }

  const visits = await db.visit.findMany({
    where: { petId: petId },
    orderBy: { date: "desc" },
    include: {
      vet: { select: { name: true, lastName: true } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Nawigacja powrotna */}
      <div className="mb-6">
        <Link
          href={`/pets/${petId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wróć do profilu {pet.name}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Historia Leczenia
          </h1>
          <p className="text-gray-500">
            Pacjent:{" "}
            <span className="font-semibold text-gray-900">{pet.name}</span>
          </p>
        </div>

        {/* To jest ten komponent, który ma Formularz + Listę */}
        <VisitSection petId={pet.id} visits={visits} userRole={role} />
      </div>
    </div>
  );
}
