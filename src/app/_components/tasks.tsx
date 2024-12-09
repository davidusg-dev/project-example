"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export type Task = {
  projectId: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
  title: string;
  completed: boolean;
};

const TasksList = ({ projectId }: { projectId: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data, isLoading, error } = api.project.listTasks.useQuery({
    projectId,
  });
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);
  if (isLoading) return <div>Cargando tareas...</div>;
  if (error) return <div>Error al cargar tareas</div>;
  return (
    <ul>
      {" "}
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title} - {task.completed ? "Completada" : "Pendiente"}
        </li>
      ))}{" "}
    </ul>
  );
};

export default TasksList;
