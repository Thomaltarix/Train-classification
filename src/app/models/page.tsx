import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ModelCard } from "@/components/model-card";
import { ModelFilterBar } from "@/components/model-filter-bar";
import { PageShell } from "@/components/page-shell";
import { modelFiltersSchema } from "@/lib/validators";
import { getModelsWithSignedUrls } from "@/services/model.service";

export const dynamic = "force-dynamic";

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const category =
    typeof resolvedSearchParams.category === "string" &&
    resolvedSearchParams.category !== ""
      ? resolvedSearchParams.category
      : undefined;
  const type =
    typeof resolvedSearchParams.type === "string" &&
    resolvedSearchParams.type !== ""
      ? resolvedSearchParams.type
      : undefined;

  const filters = modelFiltersSchema.parse({
    category,
    type,
  });

  const models = await getModelsWithSignedUrls(filters);

  return (
    <PageShell
      title="Collection"
      description="Retrouvez tous vos trains en un coup d'oeil et utilisez les filtres pour aller plus vite."
      action={
        <Link
          href="/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#1f3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#18304e]"
        >
          Ajouter un train
        </Link>
      }
    >
      <ModelFilterBar filters={filters} />
      {models.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
