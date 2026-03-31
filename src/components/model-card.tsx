import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MODEL_CATEGORY_LABELS, MODEL_TYPE_LABELS } from "@/types/models";
import type { ModelListItem } from "@/types/models";

export function ModelCard({ model }: { model: ModelListItem }) {
  return (
    <Link href={`/models/${model.id}`}>
      <Card className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="aspect-[4/3] bg-slate-100">
          {model.thumbnailUrl ? (
            <>
              {/* Signed Supabase URLs are generated on the server, so a plain img tag is the most reliable fit here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={model.thumbnailUrl}
                alt={model.name ?? model.reference}
                className="h-full w-full object-cover"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Pas d&apos;image
            </div>
          )}
        </div>
        <CardContent className="space-y-3 p-5">
          <div className="space-y-1">
            <h2 className="line-clamp-1 text-base font-semibold text-slate-950">
              {model.name ?? model.reference}
            </h2>
            <p className="text-sm text-slate-600">{model.reference}</p>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-950">Catégorie</dt>
              <dd>{MODEL_CATEGORY_LABELS[model.category]}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Type</dt>
              <dd>{MODEL_TYPE_LABELS[model.type]}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Couleur</dt>
              <dd>{model.color}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Ajouté le</dt>
              <dd>{formatDate(model.created_at)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
