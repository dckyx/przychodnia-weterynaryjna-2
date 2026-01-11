// app/visits/[id]/page.tsx

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VisitDetailsManager from "@/components/VisitDetailsManager"; // <--- Import nowego komponentu

interface VisitDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function VisitDetailsPage({
  params,
}: VisitDetailsPageProps) {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  const visitId = (await params).id;

  // 1. Sprawdź rolę
  const userId = session.userId as string;

  const currentUser = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = currentUser?.role?.trim().toLowerCase() || "guest";
  const isStaff = role === "admin" || role === "vet";

  // 2. Pobierz dane
  const visit = await db.visit.findUnique({
    where: { id: visitId },
    include: {
      pet: { include: { owner: true } },
      vet: true,
    },
  });

  if (!visit) return notFound();

  // 3. Zabezpieczenie
  if (!isStaff && visit.pet.ownerId !== session.userId) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/visits"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Wróć do terminarza
      </Link>

      {/* Używamy menedżera zamiast surowego HTML */}
      <VisitDetailsManager visit={visit} isStaff={isStaff} />
    </div>
  );
}
