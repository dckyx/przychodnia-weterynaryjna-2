"use client";

import { useState } from "react";
import { createPetAction } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save, UserPlus, Users } from "lucide-react";

type Owner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  userRole: string; // "USER" | "ADMIN" | "EMPLOYEE" | "VET"
  owners: Owner[];
};

export default function AddPetForm({ userRole, owners }: Props) {
  const [loading, setLoading] = useState(false);

  // Stan dla Admina: czy wybiera z listy, czy tworzy nowego
  const [createNewOwner, setCreateNewOwner] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // Dodajemy flagę do formData, żeby server action wiedział co robić
    formData.append("isNewOwnerMode", createNewOwner.toString());
    await createPetAction(formData);
  }

  const isStaff = ["ADMIN", "EMPLOYEE", "VET"].includes(userRole);
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/pets"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
          <p className="text-gray-500 text-sm">Wprowadź dane pacjenta</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={handleSubmit} className="space-y-8">
          {/* --- SEKCJA 1: DANE ZWIERZAKA (Bez zmian) --- */}
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
                  className="input-std"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gatunek
                </label>
                <select name="species" className="input-std bg-white">
                  <option value="pies">Pies</option>
                  <option value="kot">Kot</option>
                  <option value="inne">Inne</option>
                </select>
              </div>
              {/* ... (reszta pól zwierzaka: rasa, płeć, data, waga, url, notatki) ... */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasa
                </label>
                <input
                  name="breed"
                  required
                  type="text"
                  className="input-std"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Płeć
                </label>
                <select name="sex" className="input-std bg-white">
                  <option value="male">Samiec</option>
                  <option value="female">Samica</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data urodzenia
                </label>
                <input
                  name="birthDate"
                  required
                  type="date"
                  className="input-std"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waga (kg)
                </label>
                <input
                  name="weight"
                  required
                  type="number"
                  step="0.1"
                  className="input-std"
                />
              </div>
            </div>
          </div>

          {/* --- SEKCJA 2: WŁAŚCICIEL (LOGIKA WARUNKOWA) --- */}

          {/* PRZYPADEK A: Zwykły User - Nie widzi nic (backend przypisze go automatycznie) */}
          {!isStaff && (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
              Zwierzak zostanie automatycznie przypisany do Twojego konta.
            </div>
          )}

          {/* PRZYPADEK B: Pracownik/Admin - Wybór lub Tworzenie */}
          {isStaff && (
            <div>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Właściciel
                </h3>

                {/* Przełącznik tylko dla Admina */}
                {isAdmin && (
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCreateNewOwner(false)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                        !createNewOwner
                          ? "bg-white shadow text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Wybierz z listy
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateNewOwner(true)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                        createNewOwner
                          ? "bg-white shadow text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Stwórz nowego
                    </button>
                  </div>
                )}
              </div>

              {/* B.1: Wybór z listy (Dla Pracownika lub Admina w trybie wyboru) */}
              {!createNewOwner && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wybierz klienta z bazy
                  </label>
                  <select
                    name="ownerId"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Wybierz właściciela --</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.lastName} {owner.firstName} ({owner.email})
                      </option>
                    ))}
                  </select>
                  {!isAdmin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Pracownik może tylko przypisać do istniejącego klienta.
                    </p>
                  )}
                </div>
              )}

              {/* B.2: Tworzenie nowego (Tylko Admin w trybie tworzenia) */}
              {createNewOwner && isAdmin && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2">
                  <div className="col-span-2 text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Tworzenie nowego profilu
                    właściciela (bez konta logowania)
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Imię
                    </label>
                    <input name="ownerName" required className="input-std" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nazwisko
                    </label>
                    <input
                      name="ownerLastName"
                      required
                      className="input-std"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="ownerEmail"
                      required
                      type="email"
                      className="input-std"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input name="ownerPhone" required className="input-std" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <input name="ownerAddress" required className="input-std" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRZYCISKI */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/pets"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Zapisywanie..." : "Zapisz pacjenta"}
            </button>
          </div>
        </form>
      </div>

      {/* Helper styles for inputs to reduce repetition */}
      <style jsx>{`
        .input-std {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          color: #111827;
          transition: all 0.2s;
        }
        .input-std:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
}
