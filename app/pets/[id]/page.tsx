import { getPetById, getVisitsByPetId } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Activity, Clock } from "lucide-react";
import { VisitStatus } from "@/types";

// Helper do formatowania daty
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper do kolorów statusów
const getStatusColor = (status: VisitStatus) => {
  switch (status) {
    case "zakonczona":
      return "bg-green-100 text-green-700 border-green-200";
    case "planowana":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "w_trakcie":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "anulowana":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default async function PetDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const pet = await getPetById(params.id);
  
  if (!pet) {
    notFound();
  }

  const visits = await getVisitsByPetId(params.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Nawigacja wstecz */}
      <Link
        href="/pets"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Wróć do listy pacjentów
      </Link>

      {/* Nagłówek Profilu */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide">
              {pet.species}
            </span>
          </div>
          <p className="text-gray-500 text-lg mb-6">
            {pet.breed || "Rasa nieznana"}
          </p>
          
          <div className="flex gap-6 text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase">Wiek</span>
              <span className="font-medium">
                {new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} lat
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase">Płeć</span>
              <span className="font-medium">
                {pet.sex === "male" ? "Samiec" : pet.sex === "female" ? "Samica" : "Nieznana"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase">Waga</span>
              <span className="font-medium">{pet.weight} kg</span>
            </div>
          </div>
        </div>

        {/* Notatki */}
        {pet.notes && (
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 max-w-md">
            <h3 className="text-yellow-800 font-semibold text-sm mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notatki
            </h3>
            <p className="text-yellow-700 text-sm">{pet.notes}</p>
          </div>
        )}
      </div>

      {/* Historia Wizyt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Historia medyczna
          </h2>
        </div>

        {visits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Brak historii wizyt dla tego pacjenta.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row gap-6"
              >
                {/* Data i Status */}
                <div className="md:w-48 flex-shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatDate(visit.date)}
                  </div>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      visit.status
                    )}`}
                  >
                    {visit.status.replace("_", " ")}
                  </span>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-auto">
                    <Clock className="w-3 h-3" />
                    {visit.type}
                  </div>
                </div>

                {/* Szczegóły wizyty */}
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {visit.description}
                  </h4>
                  {visit.diagnosis && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Diagnoza: </span>
                        {visit.diagnosis}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <span className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                      Koszt: {visit.price} PLN
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}