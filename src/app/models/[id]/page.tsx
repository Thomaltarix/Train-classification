import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getModelDetail } from "@/services/model.service";
import { MODEL_CATEGORY_LABELS, MODEL_TYPE_LABELS } from "@/types/models";

export const dynamic = "force-dynamic";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = await getModelDetail(id);

  if (!model) {
    notFound();
  }

  return (
    <PageShell
      title={model.name ?? model.reference}
      description="Retrouvez ici les informations principales et les photos de ce train."
      action={
        <Link
          href="/models"
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          Retour à la collection
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.imageUrls.map((url, index) => (
            <Card key={url} className="overflow-hidden">
              {/* Signed Supabase URLs are generated at runtime, so we keep a plain img tag here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${model.name ?? model.reference} - vue ${index + 1}`}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Référence</dt>
                <dd className="text-slate-600">{model.reference}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Catégorie</dt>
                <dd className="text-slate-600">{MODEL_CATEGORY_LABELS[model.category]}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Type</dt>
                <dd className="text-slate-600">{MODEL_TYPE_LABELS[model.type]}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Couleur</dt>
                <dd className="text-slate-600">{model.color}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Longueur</dt>
                <dd className="text-slate-600">
                  {model.length ? `${model.length} mm` : "Non renseignée"}
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Date d&apos;ajout</dt>
                <dd className="text-slate-600">{formatDate(model.created_at)}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium text-slate-950">Images</dt>
                <dd className="text-slate-600">{model.imageUrls.length}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
