import "server-only";

import {
  createImages,
  createModelForUser,
  deleteModelForUser,
  getModelByIdForUser,
  getModelsForUser,
} from "@/repositories/model.repository";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getStorageBucket } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type {
  CreateModelInput,
  ModelDetail,
  ModelFilters,
  ModelListItem,
} from "@/types/models";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadImage(file: File, modelId?: string): Promise<string> {
  const user = await requireAuthenticatedUser();
  const supabase = createSupabaseServerClient();
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split(".").pop() ?? "jpg";
  const safeName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const path = [
    user.id,
    modelId ?? "unassigned",
    `${crypto.randomUUID()}-${safeName}.${fileExtension}`,
  ].join("/");

  const { error } = await supabase.storage
    .from(getStorageBucket())
    .upload(path, fileBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Unable to upload image: ${error.message}`);
  }

  return path;
}

export async function getSignedImageUrl(path: string): Promise<string> {
  const user = await requireAuthenticatedUser();

  if (!path.startsWith(`${user.id}/`)) {
    throw new Error("Unauthorized image access.");
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(getStorageBucket())
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error(`Unable to create signed URL for image: ${path}`);
  }

  return data.signedUrl;
}

async function removeUploadedImages(paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const supabase = createSupabaseServerClient();
  await supabase.storage.from(getStorageBucket()).remove(paths);
}

export async function createModelWithImages(
  input: CreateModelInput,
  files: File[],
) {
  const user = await requireAuthenticatedUser();
  const model = await createModelForUser(user.id, input);
  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      const path = await uploadImage(file, model.id);
      uploadedPaths.push(path);
    }

    await createImages(model.id, uploadedPaths);
    return model;
  } catch (error) {
    await removeUploadedImages(uploadedPaths);
    await deleteModelForUser(user.id, model.id);
    throw error;
  }
}

export async function getModelsWithSignedUrls(
  filters: ModelFilters = {},
): Promise<ModelListItem[]> {
  const user = await requireAuthenticatedUser();
  const models = await getModelsForUser(user.id, filters);

  return Promise.all(
    models.map(async (model) => ({
      ...model,
      thumbnailUrl:
        model.images[0] ? await getSignedImageUrl(model.images[0].path) : null,
    })),
  );
}

export async function getModelDetail(id: string): Promise<ModelDetail | null> {
  const user = await requireAuthenticatedUser();
  const model = await getModelByIdForUser(user.id, id);

  if (!model) {
    return null;
  }

  const imageUrls = await Promise.all(
    model.images.map((image) => getSignedImageUrl(image.path)),
  );

  return {
    ...model,
    imageUrls,
  };
}
