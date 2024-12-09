"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Card } from "~/components/ui/card";

export type Project = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string | null;
};

const ProjectsList = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const { data, isLoading, error } = api.project.listProjects.useQuery();

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  if (isLoading)
    return <div className="text-slate-500">Cargando proyectos...</div>;
  if (error)
    return <div className="text-red-500">Error al cargar proyectos</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          onClick={() => router.push(`/projects/${project.id}`)}
          className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">
                {project.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Creado el {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
