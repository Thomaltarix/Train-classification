"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createModelAction, type CreateModelActionState } from "@/app/create/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  MODEL_CATEGORIES,
  MODEL_CATEGORY_LABELS,
  MODEL_TYPES,
  MODEL_TYPE_LABELS,
} from "@/types/models";

const initialCreateModelState: CreateModelActionState = {
  status: "idle",
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-sm text-red-600">{errors[0]}</p>;
}

export function CreateModelForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createModelAction,
    initialCreateModelState,
  );

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle fiche</CardTitle>
        <CardDescription>
          Renseignez les informations principales de votre train et ajoutez
          quelques photos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-950">
              Nom
            </label>
            <Input id="name" name="name" placeholder="BB 26000 Sybic" />
            <FieldError errors={state.fieldErrors?.name} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="reference"
              className="text-sm font-medium text-slate-950"
            >
              Référence
            </label>
            <Input id="reference" name="reference" required placeholder="R37-40512" />
            <FieldError errors={state.fieldErrors?.reference} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-slate-950"
              >
                Catégorie
              </label>
              <Select id="category" name="category" required defaultValue="">
                <option value="" disabled>
                  Choisissez une catégorie
                </option>
                {MODEL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {MODEL_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </Select>
              <FieldError errors={state.fieldErrors?.category} />
            </div>

            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium text-slate-950">
                Type
              </label>
              <Select id="type" name="type" required defaultValue="">
                <option value="" disabled>
                  Choisissez un type
                </option>
                {MODEL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {MODEL_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
              <FieldError errors={state.fieldErrors?.type} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="color" className="text-sm font-medium text-slate-950">
                Couleur
              </label>
              <Input id="color" name="color" required placeholder="Vert / gris" />
              <FieldError errors={state.fieldErrors?.color} />
            </div>

            <div className="grid gap-2">
              <label htmlFor="length" className="text-sm font-medium text-slate-950">
                Longueur (mm)
              </label>
              <Input id="length" name="length" type="number" min="0" step="0.1" />
              <FieldError errors={state.fieldErrors?.length} />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="images" className="text-sm font-medium text-slate-950">
              Images
            </label>
            <Input
              id="images"
              name="images"
              type="file"
              required
              accept="image/*"
              multiple
            />
            <p className="text-sm text-slate-500">
              Ajoutez entre 1 et 3 photos pour mieux reconnaître ce train.
            </p>
            <FieldError errors={state.fieldErrors?.images} />
          </div>

          {state.message ? (
            <p
              className={
                state.status === "error" ? "text-sm text-red-600" : "text-sm text-green-700"
              }
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer le train"}
            </Button>
            <Link
              href="/models"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Voir la collection
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
