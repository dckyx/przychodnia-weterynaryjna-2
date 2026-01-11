"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPetAction(formData: FormData) {
  // Wyciągamy dane z formularza
  const name = formData.get("name") as string;
  const species = formData.get("species") as string;
  const breed = formData.get("breed") as string;
  const birthDateStr = formData.get("birthDate") as string;
  // Konwersja wagi na liczbę (jeśli puste to 0)
  const weight = parseFloat((formData.get("weight") as string) || "0");
  const notes = formData.get("notes") as string;

  // Tworzymy rekord w bazie danych
  await prisma.pet.create({
    data: {
      name,
      species,
      breed: breed || "Nieznana", // Wartość domyślna
      sex: "unknown", // Formularz nie miał pola płci, więc ustawiamy domyślnie
      ownerId: "ow1", // Przypisujemy na sztywno do przykładowego właściciela
      weight: weight,
      birthDate: new Date(birthDateStr), // Prisma wymaga obiektu Date
      notes: notes || null,
    },
  });

  // Odświeżamy ścieżkę /pets, aby nowy zwierzak pojawił się na liście
  revalidatePath("/pets");

  // Zwracamy sukces
  return { success: true };
}