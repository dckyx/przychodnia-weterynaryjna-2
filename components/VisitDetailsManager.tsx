"use client";

import { useState, useTransition } from "react";
import { editVisitAction } from "@/lib/actions";
import {
  Calendar,
  Stethoscope,
  User,
  PawPrint,
  Banknote,
  FileText,
  AlertCircle,
  Pencil,
  Save,
  X,
  Check,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import VisitStatusActions from "./VisitStatusActions";

interface VisitDetailsProps {
  visit: {
    id: string;
    date: Date;
    type: string;
    status: string;
    price: number;
    description: string;
    diagnosis?: string | null;
    vet?: { name: string; lastName: string } | null;
    pet: {
      id: string;
      name: string;
      species: string | null;
      breed: string | null;
      owner?: { name: string; lastName: string; email: string } | null;
    };
  };
  isStaff: boolean; // Informacja czy użytkownik to Vet/Admin
}

export default function VisitDetailsManager({
  visit,
  isStaff,
}: VisitDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // --- WIDOK EDYCJI (FORMULARZ) ---
  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <Pencil className="w-5 h-5" /> Edycja wizyty
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          action={async (formData) => {
            startTransition(async () => {
              await editVisitAction(formData);
              setIsEditing(false);
            });
          }}
          className="p-6 space-y-6"
        >
          <input type="hidden" name="visitId" value={visit.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status (Tylko Vet może zmienić "na siłę") */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Status
              </label>
              <select
                name="status"
                defaultValue={visit.status}
                className="w-full rounded-lg border-gray-300 text-sm"
              >
                <option value="pending">Oczekująca</option>
                <option value="confirmed">Potwierdzona</option>
                <option value="cancelled">Anulowana</option>
                <option value="completed">Zakończona</option>
              </select>
            </div>

            {/* Cena */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Cena (PLN)
              </label>
              <input
                type="number"
                name="price"
                defaultValue={visit.price}
                step="0.01"
                className="w-full rounded-lg border-gray-300 text-sm"
              />
            </div>
          </div>

          {/* Opis */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
              Opis zgłoszenia
            </label>
            <textarea
              name="description"
              defaultValue={visit.description}
              rows={3}
              className="w-full rounded-lg border-gray-300 text-sm"
            />
          </div>

          {/* Diagnoza */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase text-red-600">
              Diagnoza lekarska
            </label>
            <textarea
              name="diagnosis"
              defaultValue={visit.diagnosis || ""}
              rows={4}
              className="w-full rounded-lg border-red-200 bg-red-50 text-sm focus:border-red-500 focus:ring-red-200"
              placeholder="Wpisz diagnozę i zalecenia..."
            />
          </div>

          {/* Przyciski */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isPending ? (
                "Zapisywanie..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Zapisz zmiany
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- WIDOK PODGLĄDU (READ-ONLY) ---
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 relative group">
      {/* Przycisk Edycji (Pływający, widoczny dla Veta) */}
      {isStaff && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition"
          >
            <Pencil className="w-4 h-4" />{" "}
            <span className="text-xs font-bold">EDYTUJ</span>
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                visit.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : visit.status === "cancelled"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {visit.status === "pending" ? "Oczekująca" : visit.status}
            </span>
            <span className="text-gray-400 text-sm">
              ID: {visit.id.slice(0, 8)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {visit.type}
          </h1>
        </div>
        <div className="text-right mt-1">
          <div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {new Date(visit.date).toLocaleDateString("pl-PL")}
            </span>
          </div>
        </div>
      </div>

      {/* GRID DANYCH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
        {/* Pacjent */}
        <div className="bg-white p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <PawPrint className="w-4 h-4" /> Pacjent
          </h3>
          <p className="text-lg font-semibold text-gray-900">
            {visit.pet.name}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {visit.pet.species} • {visit.pet.breed}
          </p>
          <Link
            href={`/pets/${visit.pet.id}`}
            className="text-sm text-blue-600 hover:underline mt-1 block"
          >
            Zobacz kartotekę &rarr;
          </Link>
        </div>

        {/* Właściciel */}
        <div className="bg-white p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4" /> Właściciel
          </h3>
          <p className="text-lg font-semibold text-gray-900">
            {visit.pet.owner?.name} {visit.pet.owner?.lastName}
          </p>
          {isStaff && (
            <p className="text-sm text-gray-500">{visit.pet.owner?.email}</p>
          )}
        </div>

        {/* Lekarz */}
        <div className="bg-white p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> Lekarz Prowadzący
          </h3>
          {visit.vet ? (
            <>
              <p className="text-lg font-semibold text-gray-900">
                {visit.vet.name} {visit.vet.lastName}
              </p>
              <p className="text-sm text-gray-500">Weterynarz</p>
            </>
          ) : (
            <p className="text-gray-500 italic">Jeszcze nie przypisano</p>
          )}
        </div>

        {/* Cena */}
        <div className="bg-white p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Banknote className="w-4 h-4" /> Koszt Wizyty
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {visit.price > 0 ? visit.price.toFixed(2) : "0.00"}{" "}
            <span className="text-sm font-normal text-gray-500">PLN</span>
          </p>
        </div>
      </div>

      {/* OPIS I DIAGNOZA */}
      <div className="p-8 bg-white border-t border-gray-100 space-y-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Opis zgłoszenia
          </h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
            {visit.description}
          </p>
        </div>

        {(visit.diagnosis || isStaff) && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Diagnoza lekarska
            </h3>
            {visit.diagnosis ? (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-900 leading-relaxed">
                {visit.diagnosis}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">
                Brak diagnozy. Kliknij "Edytuj" aby dodać.
              </p>
            )}
          </div>
        )}
      </div>

      {/* SEKCJA AKCJI (Przyciski Przyjmij/Odrzuć tylko gdy Pending) */}
      {isStaff && visit.status === "pending" && (
        <div className="p-6 bg-yellow-50 border-t border-yellow-100">
          <h3 className="text-sm font-bold text-yellow-800 mb-4 uppercase tracking-wide">
            Decyzja personelu
          </h3>
          <VisitStatusActions visitId={visit.id} />
        </div>
      )}
    </div>
  );
}
