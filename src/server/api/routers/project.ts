import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { projects, tasks } from "~/server/db/schema";

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "El nombre del proyecto es obligatorio"),
      }),
    )
    .mutation(async ({ input }) => {
      return db.insert(projects).values({ name: input.name });
    }),

  listProjects: publicProcedure.query(async () => {
    return db.select().from(projects);
  }),

  createTask: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string().min(1, "El título de la tarea es obligatorio"),
      }),
    )
    .mutation(async ({ input }) => {
      return db.insert(tasks).values({
        projectId: input.projectId,
        title: input.title,
      });
    }),

  listTasks: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.projectId, input.projectId));
    }),

  getProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));
      return result[0];
    }),

  updateProject: publicProcedure
    .input(
      z.object({
        id: z.number(),
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return db
        .update(projects)
        .set({ imageUrl: input.imageUrl })
        .where(eq(projects.id, input.id));
    }),
});
