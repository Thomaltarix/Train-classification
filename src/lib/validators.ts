import { z } from "zod";

import { MODEL_CATEGORIES, MODEL_TYPES } from "@/types/models";

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const optionalLength = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? undefined : Number(trimmedValue);
}, z.number().positive("La longueur doit etre positive.").optional());

export const createModelSchema = z.object({
  name: optionalString,
  reference: z.string().trim().min(1, "La reference est obligatoire."),
  category: z.enum(MODEL_CATEGORIES, {
    message: "Choisissez une categorie valide.",
  }),
  type: z.enum(MODEL_TYPES, {
    message: "Choisissez un type valide.",
  }),
  color: z.string().trim().min(1, "La couleur est obligatoire."),
  length: optionalLength,
});

export const modelFiltersSchema = z.object({
  category: z.enum(MODEL_CATEGORIES).optional(),
  type: z.enum(MODEL_TYPES).optional(),
});

export const imageFilesSchema = z
  .array(
    z
      .instanceof(File)
      .refine((file) => file.size > 0, "Ajoutez au moins une image valide.")
      .refine(
        (file) => file.type.startsWith("image/"),
        "Chaque fichier doit etre une image.",
      ),
  )
  .min(1, "Ajoutez au moins une image.")
  .max(3, "Vous pouvez televerser jusqu'a 3 images.");
