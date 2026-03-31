export const MODEL_CATEGORIES = [
  "locomotive",
  "voiture",
  "wagon",
  "automotrice",
  "autorail",
  "engin_chantier",
] as const;

export const MODEL_TYPES = ["electrique", "diesel"] as const;

export const MODEL_CATEGORY_LABELS: Record<ModelCategory, string> = {
  locomotive: "Locomotive",
  voiture: "Voiture",
  wagon: "Wagon",
  automotrice: "Automotrice",
  autorail: "Autorail",
  engin_chantier: "Engin de chantier",
};

export const MODEL_TYPE_LABELS: Record<ModelType, string> = {
  electrique: "Electrique",
  diesel: "Diesel",
};

export type ModelCategory = (typeof MODEL_CATEGORIES)[number];
export type ModelType = (typeof MODEL_TYPES)[number];

export interface ModelRecord {
  id: string;
  name: string | null;
  reference: string;
  category: ModelCategory;
  type: ModelType;
  color: string;
  length: number | null;
  created_at: string;
}

export interface ImageRecord {
  id: string;
  model_id: string;
  path: string;
  created_at?: string;
}

export interface ModelWithImages extends ModelRecord {
  images: ImageRecord[];
}

export interface ModelListItem extends ModelRecord {
  images: ImageRecord[];
  thumbnailUrl: string | null;
}

export interface ModelDetail extends ModelRecord {
  imageUrls: string[];
}

export interface ModelFilters {
  category?: ModelCategory;
  type?: ModelType;
}

export interface CreateModelInput {
  name?: string;
  reference: string;
  category: ModelCategory;
  type: ModelType;
  color: string;
  length?: number;
}
