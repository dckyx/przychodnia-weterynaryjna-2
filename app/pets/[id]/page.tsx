import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DeletePetButton from "@/components/DeletePetButton";
import Image from "next/image";
interface PetPageProps {
  params: Promise<{ id: string }>;
}

export default async function PetPage({ params }: PetPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return notFound();
  }

  const pet = await db.pet.findUnique({
    where: { id: id },
  });

  if (!pet) {
    return notFound();
  }

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
        {pet.imageUrl && (
          <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-center">
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              width={250}
              height={250}
              className="rounded-xl object-cover max-h-[250px]"
            />
          </div>
        )}
        <div
          className={`bg-white rounded-2xl shadow-sm border p-8 ${
            pet.imageUrl ? "md:col-span-2" : "md:col-span-3"
          }`}
        >
          <div className=" flex justify-end">
            <DeletePetButton petId={pet.id} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h1>
          <p className="text-gray-500 mb-6 capitalize">
            {pet.species} • {pet.breed}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informacje</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">Waga:</span>{" "}
                  {pet.weight} kg
                </li>
                <li>
                  <span className="font-medium text-gray-800">
                    Data urodzenia:
                  </span>{" "}
                  {new Date(pet.birthDate).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </li>
                {pet.sex && (
                  <li>
                    <span className="font-medium text-gray-800">Płeć:</span>{" "}
                    {pet.sex}
                  </li>
                )}
              </ul>
            </div>

            {pet.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notatki</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl italic">
                  {pet.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
