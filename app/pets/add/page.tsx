"use client";

import { useState } from "react";
import { createPetAction } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddPetPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createPetAction(formData);
  }

  return (
    <div className="max-w-2xl mx-auto mb-10">
      {/* Nagłówek z powrotem */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/pets"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
          <p className="text-gray-500 text-sm">
            Wprowadź dane właściciela i zwierzaka
          </p>
        </div>
      </div>

      {/* Formularz - action={handleSubmit} pozwala używać Server Actions w Client Component */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={handleSubmit} className="space-y-8">
          {/* dane */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Dane Pacjenta
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię zwierzaka
                </label>
                <input
                  name="petName"
                  required
                  type="text"
                  placeholder="np. Reksio"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Gatunek */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gatunek
                </label>
                <select
                  name="species"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option value="pies">Pies</option>
                  <option value="kot">Kot</option>
                  <option value="inne">Inne</option>
                </select>
              </div>

              {/* Rasa */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasa
                </label>
                <input
                  name="breed"
                  required
                  type="text"
                  placeholder="np. Mieszaniec"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Płeć */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Płeć
                </label>
                <select
                  name="sex"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option value="male">Samiec</option>
                  <option value="female">Samica</option>
                </select>
              </div>

              {/* Data urodzenia */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data urodzenia
                </label>
                <input
                  name="birthDate"
                  required
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Waga */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waga (kg)
                </label>
                <input
                  name="weight"
                  required
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* URL zdjęcia */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL zdjęcia
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Notatki */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notatki
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SEKCJA 2: DANE WŁAŚCICIELA */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Dane Właściciela
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię
                </label>
                <input
                  name="ownerName"
                  required
                  type="text"
                  placeholder="Jan"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko
                </label>
                <input
                  name="ownerLastName"
                  required
                  type="text"
                  placeholder="Kowalski"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="ownerEmail"
                  required
                  type="email"
                  placeholder="jan@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  name="ownerPhone"
                  required
                  type="tel"
                  placeholder="123 456 789"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <input
                  name="ownerAddress"
                  required
                  type="text"
                  placeholder="ul. Wiejska 1, 00-001 Warszawa"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* PRZYCISKI */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/pets"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? "Zapisywanie..." : "Zapisz pacjenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
