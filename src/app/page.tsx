import ProjectsList from "~/app/_components/projects";

export default async function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-slate-900">
        Gestor de Proyectos
      </h1>
      <div className="w-full">
        <ProjectsList />
      </div>
    </main>
  );
}
