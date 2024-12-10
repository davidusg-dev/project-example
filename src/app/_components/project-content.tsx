"use client";

import { api } from "~/trpc/react";
import TasksTable from "./tasks-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Project } from "./projects";

export function ProjectContent({
  initialProject,
}: {
  initialProject: Project;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [imageKey, setImageKey] = useState(0);

  const { mutate: updateProject } = api.project.updateProject.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

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
        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
          {project.imageUrl ? (
            <>
              <Image
                key={imageKey}
                src={project.imageUrl}
                alt={project.name}
                width={96}
                height={96}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      updateProject({
                        id: project.id,
                        imageUrl: res[0].url,
                      });
                    }
                  }}
                  className="ut-button:h-8 ut-button:w-8 ut-button:p-0"
                />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("res", res);
                  if (res && res[0]) {
                    setProject({
                      ...project,
                      imageUrl: res[0].url,
                    });

                    setImageKey((prev) => prev + 1);
                  }
                  router.refresh();
                }}
                className="ut-button:h-8 ut-button:w-8 ut-button:p-0"
              />
            </div>
          )}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <TasksTable projectId={project.id} />
      </div>
    </main>
  );
}
