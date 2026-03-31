import { CreateModelForm } from "@/components/create-model-form";
import { PageShell } from "@/components/page-shell";

export default function CreatePage() {
  return (
    <PageShell
      title="Ajouter un train"
      description="Remplissez les informations principales et ajoutez quelques photos pour garder une fiche claire."
    >
      <CreateModelForm />
    </PageShell>
  );
}
