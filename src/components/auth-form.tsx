"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  status: "idle",
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-sm text-red-600">{errors[0]}</p>;
}

export function AuthForm({
  title,
  description,
  submitLabel,
  action,
}: {
  title: string;
  description: string;
  submitLabel: string;
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo, state.status]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor={`${submitLabel}-email`} className="text-sm font-medium text-slate-950">
              Email
            </label>
            <Input
              id={`${submitLabel}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor={`${submitLabel}-password`}
              className="text-sm font-medium text-slate-950"
            >
              Mot de passe
            </label>
            <Input
              id={`${submitLabel}-password`}
              name="password"
              type="password"
              autoComplete={
                submitLabel.toLowerCase().includes("creer")
                  ? "new-password"
                  : "current-password"
              }
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          {state.message ? (
            <p
              className={
                state.status === "error"
                  ? "text-sm text-red-600"
                  : "text-sm text-green-700"
              }
            >
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Chargement..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
