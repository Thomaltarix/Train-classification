import { redirectIfAuthenticated } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { loginAction, signupAction } from "@/app/login/actions";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff_0%,#edf3f8_40%,#dbe4ee_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full gap-6 rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <section className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#1f3a5f]">
              Ma collection de trains
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Entrez dans votre espace personnel
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Connectez-vous pour retrouver vos trains, ajouter de nouvelles
              fiches et consulter vos photos en toute tranquillité.
            </p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Si vous venez de créer votre compte, il faudra peut-être confirmer
              votre adresse e-mail avant de pouvoir vous connecter.
            </div>
          </section>

          <div className="grid gap-6">
            <AuthForm
              title="Connexion"
              description="Saisissez votre adresse e-mail et votre mot de passe."
              submitLabel="Se connecter"
              action={loginAction}
            />
            <AuthForm
              title="Créer un compte"
              description="Créez votre espace personnel pour enregistrer votre collection."
              submitLabel="Créer mon compte"
              action={signupAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
