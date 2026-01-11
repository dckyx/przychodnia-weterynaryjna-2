import Link from "next/link";
import { Pet } from "@/types";
import { Dog, Cat, Rabbit, ArrowRight } from "lucide-react";
import DeletePetButton from "./DeletePetButton";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const getAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return "-";
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 35) {
      const weeks = Math.floor(diffDays / 7);
      if (weeks <= 1) return "1 tydzień";
      if (weeks >= 2 && weeks <= 4) return `${weeks} tygodnie`;
      return `${weeks} tygodni`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      if (months <= 1) return "1 miesiąc";
      if (months >= 2 && months <= 4) return `${months} miesiące`;
      return `${months} miesięcy`;
    }
    const years = today.getFullYear() - birthDate.getFullYear();
    if (years === 1) return "1 rok";
    if (
      years % 10 >= 2 &&
      years % 10 <= 4 &&
      (years % 100 < 10 || years % 100 >= 20)
    )
      return `${years} lata`;
    return `${years} lat`;
  };

  const age = getAge(pet.birthDate);

  const getTheme = (species: string) => {
    switch (species.toLowerCase()) {
      case "pies":
        return {
          bg: "bg-blue-50",
          border: "border-blue-100",
          iconColor: "text-blue-600",
          icon: <Dog className="w-6 h-6" />,
          label: "Pies",
        };
      case "kot":
        return {
          bg: "bg-orange-50",
          border: "border-orange-100",
          iconColor: "text-orange-600",
          icon: <Cat className="w-6 h-6" />,
          label: "Kot",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          iconColor: "text-gray-600",
          icon: <Rabbit className="w-6 h-6" />,
          label: species,
        };
    }
  };

  const theme = getTheme(pet.species);

  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg
      ${theme.bg} ${theme.border}
    `}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-3 rounded-xl bg-white shadow-sm ${theme.iconColor}`}
          >
            {theme.icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {theme.label}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{pet.breed}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white/50 p-3 rounded-xl mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Wiek</span>
            <span className="font-medium">{age}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Waga</span>
            <span className="font-medium">{pet.weight} kg</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={`/pets/${pet.id}`}
            className="group flex-grow-[2] flex items-center justify-between py-2.5 px-4 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:text-blue-600 transition-colors"
          >
            <span>Profil i historia</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <DeletePetButton petId={pet.id} />
        </div>
      </div>
    </div>
  );
}
