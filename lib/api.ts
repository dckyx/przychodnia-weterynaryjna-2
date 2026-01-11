import { prisma } from "@/lib/db";
import { Pet, Visit, User } from "@/types";
import { users } from "@/data/mock"; // Użytkowników na razie zostawiamy z mocka

// Pobieranie wszystkich zwierząt
export async function getAllPets() {
  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Mapowanie danych z bazy na format oczekiwany przez frontend
  return pets.map((pet) => ({
    ...pet,
    // Baza zwraca Date, frontend chce string
    birthDate: pet.birthDate.toISOString(),
    // Obsługa nulli (jeśli w bazie są nulle, a typy TS ich nie dopuszczają)
    breed: pet.breed || "Nieznana",
    notes: pet.notes || undefined,
    imageUrl: pet.imageUrl || undefined,
    // Rzutowanie typów enum/union
    species: pet.species as "pies" | "kot" | "inne",
    sex: pet.sex as "male" | "female" | "unknown",
  }));
}

// Pobieranie pojedynczego zwierzaka po ID
export async function getPetById(id: string) {
  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet) return undefined;

  return {
    ...pet,
    birthDate: pet.birthDate.toISOString(),
    breed: pet.breed || "Nieznana",
    notes: pet.notes || undefined,
    imageUrl: pet.imageUrl || undefined,
    species: pet.species as "pies" | "kot" | "inne",
    sex: pet.sex as "male" | "female" | "unknown",
  };
}

// Pobieranie wizyt dla zwierzaka
export async function getVisitsByPetId(petId: string) {
  const visits = await prisma.visit.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });

  return visits.map((visit) => ({
    ...visit,
    date: visit.date.toISOString(),
    // Rzutowanie stringów z bazy na konkretne typy wizyt
    type: visit.type as any,
    status: visit.status as any,
    diagnosis: visit.diagnosis || undefined,
  }));
}

// Użytkownicy (nadal z pliku mock, bo nie robiliśmy tabeli User)
export async function getUserById(id: string): Promise<User | undefined> {
  // Symulacja opóźnienia, żeby zachować spójność z resztą asynchronicznego kodu
  await new Promise((resolve) => setTimeout(resolve, 100));
  return users.find((user) => user.id === id);
}