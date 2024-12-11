import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Get projectId from the request header
      const projectId = req.headers.get("x-project-id");
      if (!projectId) throw new UploadThingError("Project ID is required");

      return { userId: user.userId, projectId: parseInt(projectId) };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update project with new image URL
      await db
        .update(projects)
        .set({ imageUrl: file.url })
        .where(eq(projects.id, metadata.projectId));

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
