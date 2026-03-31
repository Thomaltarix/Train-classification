import Link from "next/link";

import { logoutAction } from "@/app/login/actions";
import { requirePageUser } from "@/lib/auth";

export async function PageShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const user = await requirePageUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff_0%,#edf3f8_40%,#dbe4ee_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-start px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/78 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <header className="border-b border-slate-200/80 bg-white/72">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
              <div>
                <Link href="/" className="text-lg font-semibold text-slate-950">
                  Ma collection de trains
                </Link>
                <p className="text-sm text-slate-600">
                  Un rangement simple pour vos trains miniatures
                </p>
              </div>
              <nav className="flex items-center gap-4">
                <span className="hidden text-sm text-slate-500 md:inline">
                  {user.email}
                </span>
                <Link
                  href="/models"
                  className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  Collection
                </Link>
                <Link
                  href="/create"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#1f3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#18304e]"
                >
                  Ajouter un train
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                    Se déconnecter
                  </button>
                </form>
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h1>
                {description ? (
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                ) : null}
              </div>
              {action}
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
