import { api } from "~/trpc/server";
import TasksTable from "~/app/_components/tasks-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ProjectTasks({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;

  const project = await api.project.getProject({
    id: parseInt(resolvedParams.id),
  });

  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {project.name}
        </h1>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <TasksTable projectId={project.id} />
      </div>
    </main>
  );
}
