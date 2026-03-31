import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ModelCard } from "@/components/model-card";
import { PageShell } from "@/components/page-shell";
import { requirePageUser } from "@/lib/auth";
import { getModelsWithSignedUrls } from "@/services/model.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requirePageUser();
  const latestModels = await getModelsWithSignedUrls();

  return (
    <PageShell
      title="Bienvenue dans votre collection"
      description="Retrouvez ici vos derniers trains ajoutés et accédez rapidement aux fiches de votre collection."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#1f3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#18304e]"
          >
            Ajouter un modele
          </Link>
          <Link
            href="/models"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
          >
            Voir la collection
          </Link>
        </div>
      }
    >
      {latestModels.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              Derniers modèles ajoutés
            </h2>
            <Link
              href="/models"
              className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {latestModels.slice(0, 3).map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
