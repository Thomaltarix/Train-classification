"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth";
import { createModelSchema, imageFilesSchema } from "@/lib/validators";
import { createModelWithImages } from "@/services/model.service";

export type CreateModelActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  redirectTo?: string;
};

export async function createModelAction(
  _prevState: CreateModelActionState,
  formData: FormData,
): Promise<CreateModelActionState> {
  const parsedFields = createModelSchema.safeParse({
    name: formData.get("name"),
    reference: formData.get("reference"),
    category: formData.get("category"),
    type: formData.get("type"),
    color: formData.get("color"),
    length: formData.get("length"),
  });

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const parsedFiles = imageFilesSchema.safeParse(files);

  if (!parsedFields.success || !parsedFiles.success) {
    return {
      status: "error",
      message: "Veuillez corriger le formulaire avant de continuer.",
      fieldErrors: {
        ...(parsedFields.success
          ? {}
          : parsedFields.error.flatten().fieldErrors),
        images: parsedFiles.success
          ? undefined
          : parsedFiles.error.issues.map((issue) => issue.message),
      },
    };
  }

  try {
    await requireAuthenticatedUser();
    const model = await createModelWithImages(parsedFields.data, parsedFiles.data);

    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath(`/models/${model.id}`);

    return {
      status: "success",
      message: "Le train a bien été enregistré.",
      redirectTo: `/models/${model.id}`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.",
    };
  }
}
