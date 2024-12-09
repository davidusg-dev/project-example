import { api } from "~/trpc/server";
import { ProjectContent } from "~/app/_components/project-content";

type Params = Promise<{ id: string }>;

export default async function ProjectTasks(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  const project = await api.project.getProject({
    id: parseInt(id),
  });

  if (!project) return <div>Proyecto no encontrado</div>;

  return <ProjectContent initialProject={project} />;
}
