"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import type { Task } from "./tasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

const TasksTable = ({ projectId }: { projectId: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data, isLoading, error } = api.project.listTasks.useQuery({
    projectId,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">Cargando tareas...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Error al cargar tareas</div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estado</TableHead>
          <TableHead className="w-[40%]">Título</TableHead>
          <TableHead>Creado el</TableHead>
          <TableHead>Actualizado el</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-slate-500">
              No hay tareas para mostrar
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {task.completed ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completada
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Circle className="h-3 w-3" />
                      Pendiente
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(task.updatedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TasksTable;
