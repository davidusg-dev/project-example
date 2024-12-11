"use client";

import { useEffect, useState } from "react";
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
import { assignTask, getAssignableUsers, listTasks } from "~/server/actions";
import { type User, type Task } from "~/types";

export default function TasksTable({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, usersData] = await Promise.all([
          listTasks(projectId),
          getAssignableUsers(),
        ]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [projectId]);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

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
                onValueChange={async (userId: string) => {
                  await assignTask(task.id, userId);
                  setTasks(
                    tasks.map((t) => (t.id === task.id ? { ...t, userId } : t)),
                  );
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
