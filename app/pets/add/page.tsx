"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, PawPrint } from "lucide-react";
import { createPetAction } from "@/app/actions"; // Importujemy naszą nową akcję

export default function AddPetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Wywołujemy Server Action
      await createPetAction(formData);
      
      // Sukces! Bez alertu, od razu przekierowanie.
      router.push("/pets");
    } catch (error) {
      console.error("Błąd dodawania:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/pets"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anuluj i wróć do listy
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PawPrint className="w-8 h-8 text-blue-600" />
          Dodaj nowego pacjenta
        </h1>
        <p className="text-gray-500 mt-2">
          Wypełnij formularz, aby utworzyć nową kartotekę.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
      >
        {/* Imię */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imię zwierzaka
          </label>
          <input
            name="name" // Ważne: atrybut name jest potrzebny dla FormData
            type="text"
            required
            placeholder="np. Burek"
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gatunek */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gatunek
            </label>
            <select
              name="species"
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border bg-white"
            >
              <option value="pies">Pies</option>
              <option value="kot">Kot</option>
              <option value="inne">Inne</option>
            </select>
          </div>

          {/* Rasa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rasa (opcjonalnie)
            </label>
            <input
              name="breed"
              type="text"
              placeholder="np. Owczarek Niemiecki"
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data urodzenia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data urodzenia
            </label>
            <input
              name="birthDate"
              type="date"
              required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
            />
          </div>

          {/* Waga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waga (kg)
            </label>
            <input
              name="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
            />
          </div>
        </div>

        {/* Notatki */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notatki / Znaki szczególne
          </label>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
            placeholder="Dodatkowe informacje o pacjencie..."
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100">
          <Link
            href="/pets"
            className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz pacjenta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}