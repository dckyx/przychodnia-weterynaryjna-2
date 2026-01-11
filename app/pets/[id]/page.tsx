import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react"; // Dodałem ikonę Stethoscope
import DeletePetButton from "@/components/DeletePetButton";
import Image from "next/image";

interface PetPageProps {
  params: Promise<{ id: string }>;
}

export default async function PetPage({ params }: PetPageProps) {
  // 1. Sprawdzamy czy user jest zalogowany
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  const userId = session.userId as string; // Fix dla TypeScript

  // 2. Pobieramy dane
  const resolvedParams = await params;
  const pet = await db.pet.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!pet) return notFound();

  // Prosta logika uprawnień
  const isOwner = pet.ownerId === userId;
  const isAdmin = session.role === "admin";
  const showDeleteButton = isOwner || isAdmin;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/pets"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Wróć do listy
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ZDJĘCIE */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-center h-fit">
          {pet.imageUrl ? (
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              width={250}
              height={250}
              className="rounded-xl object-cover aspect-square w-full"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Brak zdjęcia
            </div>
          )}
        </div>

        {/* DANE */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-500 capitalize">
                {pet.species} • {pet.breed}
              </p>
            </div>

            {/* PRZYCISKI AKCJI */}
            <div className="flex flex-col items-end gap-3">
              {/* NOWY PRZYCISK: Link do osobnej podstrony z wizytami */}
              <Link
                href={`/pets/${pet.id}/visits`}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200 shadow-sm text-sm"
              >
                <Stethoscope className="w-4 h-4" />
                Historia leczenia
              </Link>

              {/* Przycisk usuwania (tylko dla uprawnionych) */}
              {showDeleteButton && <DeletePetButton petId={pet.id} />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">
                Dane podstawowe
              </h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Waga:</span>
                  <span className="font-medium text-gray-900">
                    {pet.weight} kg
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Data ur.:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(pet.birthDate).toLocaleDateString("pl-PL")}
                  </span>
                </li>
                {pet.sex && (
                  <li className="flex justify-between">
                    <span className="text-gray-500">Płeć:</span>
                    <span className="font-medium text-gray-900">{pet.sex}</span>
                  </li>
                )}
              </ul>
            </div>

            {pet.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">
                  Notatki
                </h3>
                <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg text-sm border border-yellow-100 italic">
                  "{pet.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
