import "server-only";

import { createSupabaseAuthServerClient } from "@/lib/supabaseAuth";
import type {
  CreateModelInput,
  ImageRecord,
  ModelFilters,
  ModelWithImages,
} from "@/types/models";

type ModelRow = {
  id: string;
  name: string | null;
  reference: string;
  category: string;
  type: string;
  color: string;
  length: number | null;
  created_at: string;
  images?: ImageRecord[];
};

function mapModel(row: ModelRow): ModelWithImages {
  return {
    ...row,
    category: row.category as ModelWithImages["category"],
    type: row.type as ModelWithImages["type"],
    images: row.images ?? [],
  };
}

function toRepositoryErrorMessage(context: string, message: string) {
  if (message.includes("column models.user_id does not exist")) {
    return `${context}: missing database migration. Apply supabase/migrations/001_add_user_ownership.sql to add models.user_id and RLS policies.`;
  }

  return `${context}: ${message}`;
}

export async function createModelForUser(userId: string, data: CreateModelInput) {
  const supabase = await createSupabaseAuthServerClient();
  const { data: model, error } = await supabase
    .from("models")
    .insert({
      user_id: userId,
      name: data.name ?? null,
      reference: data.reference,
      category: data.category,
      type: data.type,
      color: data.color,
      length: data.length ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(toRepositoryErrorMessage("Unable to create model", error.message));
  }

  return mapModel({ ...model, images: [] });
}

export async function createImages(modelId: string, paths: string[]) {
  const supabase = await createSupabaseAuthServerClient();
  const { error } = await supabase.from("images").insert(
    paths.map((path) => ({
      model_id: modelId,
      path,
    })),
  );

  if (error) {
    throw new Error(toRepositoryErrorMessage("Unable to save images", error.message));
  }
}

export async function deleteModelForUser(userId: string, id: string) {
  const supabase = await createSupabaseAuthServerClient();
  const { error } = await supabase
    .from("models")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(toRepositoryErrorMessage("Unable to delete model", error.message));
  }
}

export async function getModelsForUser(
  userId: string,
  filters: ModelFilters = {},
) {
  const supabase = await createSupabaseAuthServerClient();

  let query = supabase
    .from("models")
    .select(
      "id, name, reference, category, type, color, length, created_at, images(id, model_id, path)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(toRepositoryErrorMessage("Unable to load models", error.message));
  }

  return (data satisfies ModelRow[]).map(mapModel);
}

export async function getModelByIdForUser(userId: string, id: string) {
  const supabase = await createSupabaseAuthServerClient();
  const { data, error } = await supabase
    .from("models")
    .select(
      "id, name, reference, category, type, color, length, created_at, images(id, model_id, path)",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(toRepositoryErrorMessage("Unable to load model", error.message));
  }

  return mapModel(data satisfies ModelRow);
}
