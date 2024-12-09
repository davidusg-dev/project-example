import ProjectsList from "~/app/_components/projects";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <SignedOut>
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/50 px-4">
          <div className="container flex max-w-3xl flex-col items-center text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Gestiona tus proyectos de forma eficiente
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              Una plataforma simple pero poderosa para gestionar proyectos y
              tareas. Organiza tu trabajo, colabora con tu equipo y alcanza tus
              objetivos.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up" className="inline-flex items-center gap-2">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
      </SignedOut>

      <SignedIn>
        <main className="container mx-auto py-8">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-slate-900">
            Gestor de Proyectos
          </h1>
          <div className="w-full">
            <ProjectsList />
          </div>
        </main>
      </SignedIn>
    </>
  );
}
