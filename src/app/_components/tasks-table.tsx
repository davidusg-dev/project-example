"use client";

import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function TasksTable({ projectId }: { projectId: number }) {
  const utils = api.useUtils();
  const { data: tasks } = api.project.listTasks.useQuery({ projectId });
  const { data: users } = api.project.getAssignableUsers.useQuery();

  const assignTask = api.project.assignTask.useMutation({
    onSuccess: async () => {
      await utils.project.listTasks.invalidate({ projectId });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Task</TableHead>
          <TableHead className="w-[40%]">Assigned To</TableHead>
          <TableHead className="w-[20%]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks?.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <Select
                value={task.userId ?? ""}
                onValueChange={(userId: string) => {
                  assignTask.mutate({
                    taskId: task.id,
                    userId,
                  });
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Badge variant={task.completed ? "success" : "secondary"}>
                {task.completed ? "Completed" : "Pending"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
