"use server";

import { db } from "~/server/db";
import { projects, tasks } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { createClerkClient } from "@clerk/nextjs/server";
import { env } from "~/env";
import { revalidatePath } from "next/cache";

export async function listProjects() {
    return db.select().from(projects);
}

export async function getProject(id: number) {
    const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));
    return result[0];
}

export async function createProject(name: string) {
    await db.insert(projects).values({ name });
}

export async function listTasks(projectId: number) {
    return db
        .select()
        .from(tasks)
        .where(eq(tasks.projectId, projectId))
        .orderBy(tasks.id);
}

export async function createTask(projectId: number, title: string) {
    await db.insert(tasks).values({
        projectId,
        title,
    });
}

export async function assignTask(taskId: number, userId: string) {
    const task = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .then(rows => rows[0]);

    await db
        .update(tasks)
        .set({ userId })
        .where(eq(tasks.id, taskId));
}

export async function updateProject(id: number, imageUrl: string) {
    await db
        .update(projects)
        .set({ imageUrl })
        .where(eq(projects.id, id));
}

export async function getAssignableUsers() {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const users = await clerk.users.getUserList();

    return users.data.map(user => ({
        id: user.id,
        username: user.username,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        imageUrl: user.imageUrl ?? '',
    }));
}
