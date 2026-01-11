"use server";

import { createPet, createUser } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
export async function createPetAction(formData: FormData) {
  const newOwner = await createUser({
    name: formData.get("ownerName") as string,
    lastName: formData.get("ownerLastName") as string,
    email: formData.get("ownerEmail") as string,
    phone: formData.get("ownerPhone") as string,
    role: "owner",
    address: formData.get("ownerAddress") as string,
  });

  await createPet({
    ownerId: newOwner.id,
    name: formData.get("petName") as string,
    species: formData.get("species") as "pies" | "kot" | "inne",
    sex: formData.get("sex") as "male" | "female",
    breed: formData.get("breed") as string,
    weight: parseFloat(formData.get("weight") as string),
    birthDate: formData.get("birthDate") as string,
    notes: formData.get("notes") as string,
    imageUrl: formData.get("imageUrl") as string,
  });

  revalidatePath("/pets");
  redirect("/pets");
}

export async function deletePetAction(petId: string) {
  await db.pet.delete({
    where: {
      id: petId,
    },
  });
  revalidatePath("/pets");
  redirect("/pets");
}
