import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Aucun train enregistré</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-600">
          Commencez par ajouter votre premier train pour créer votre collection.
        </p>
        <Link
          href="/create"
          className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-[#1f3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#18304e]"
        >
          Ajouter un train
        </Link>
      </CardContent>
    </Card>
  );
}
