"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseAuthServerClient } from "@/lib/supabaseAuth";
import type { AuthActionState } from "@/types/auth";
import { z } from "zod";

const authSchema = z.object({
  email: z.email("Entrez une adresse email valide.").trim(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres."),
});

function parseAuthForm(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

function getFriendlyAuthErrorMessage(message: string) {
  if (message === "Invalid login credentials") {
    return "Identifiants invalides. Si vous venez de creer le compte, verifiez d'abord l'email de confirmation Supabase.";
  }

  return message;
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseAuthForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Veuillez corriger le formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: getFriendlyAuthErrorMessage(error.message),
    };
  }

  revalidatePath("/", "layout");

  return {
    status: "success",
    message: "Connexion reussie.",
    redirectTo: "/models",
  };
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseAuthForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Veuillez corriger le formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseAuthServerClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return {
      status: "error",
      message: getFriendlyAuthErrorMessage(error.message),
    };
  }

  revalidatePath("/", "layout");

  return {
    status: "success",
    message: data.session
      ? "Compte cree et connecte."
      : "Compte cree. Verifiez votre boite email et confirmez l'adresse avant de vous connecter si la confirmation est active.",
    redirectTo: data.session ? "/models" : undefined,
  };
}

export async function logoutAction() {
  const supabase = await createSupabaseAuthServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
