import Link from "next/link";

import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell
      title="Train introuvable"
      description="Cette fiche n'existe pas ou n'est plus disponible."
      action={
        <Link
          href="/models"
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          Retour à la collection
        </Link>
      }
    >
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-sm text-slate-600">
        Revenez à la liste pour choisir un autre train.
      </div>
    </PageShell>
  );
}
