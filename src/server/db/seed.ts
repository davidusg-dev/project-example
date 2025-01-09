import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { env } from "~/env";
import postgres from "postgres";

const sql = postgres(env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 20,
});
const db = drizzle(sql, { schema });

// Function to generate plausible tasks based on project
function generateTasksForProject(
  projectName: string,
): { title: string; completed: boolean }[] {
  const baseTasks = [
    "Planificación inicial del proyecto",
    "Análisis de requerimientos",
    "Diseño de arquitectura",
    "Desarrollo de funcionalidades core",
    "Implementación de base de datos",
    "Testing unitario",
    "Testing de integración",
    "Documentación técnica",
    "Despliegue en staging",
    "Lanzamiento a producción",
  ];

  return baseTasks.map((taskTitle) => ({
    title: `${taskTitle} (${projectName})`,
    completed: Math.random() > 0.7, // ~30% chance of being completed
  }));
}

const main = async () => {
  try {
    // Delete existing data
    console.log("Limpiando base de datos...");
    await db.delete(schema.tasks);
    await db.delete(schema.projects);

    const projectNames = [
      "Sistema de Gestión de Inventario",
      "Portal de E-commerce",
      "App de Delivery",
      "Sistema de Recursos Humanos",
      "Plataforma de E-learning",
      "CRM Empresarial",
      "Sistema de Facturación",
      "App de Gestión de Tareas",
      "Portal de Noticias",
      "Sistema de Reservas",
    ];

    console.log("Insertando proyectos y tareas...");

    // Insert projects and return inserted project IDs
    const insertedProjects = await db
      .insert(schema.projects)
      .values(projectNames.map((name) => ({ name })))
      .returning();

    console.log(`Se insertaron ${insertedProjects.length} proyectos.`);

    let totalTasksInserted = 0;

    // For each project, create tasks
    for (const project of insertedProjects) {
      console.log(`Insertando tareas para el proyecto: ${project.name}`);

      const projectTasks = generateTasksForProject(project.name).map(
        (task) => ({
          projectId: project.id, // Ensure `id` exists in the schema
          title: task.title,
          completed: task.completed,
        }),
      );

      const insertedTasks = await db
        .insert(schema.tasks)
        .values(projectTasks)
        .returning();

      console.log(
        `Se insertaron ${insertedTasks.length} tareas para el proyecto: ${project.name}`,
      );
      totalTasksInserted += insertedTasks.length;

      // Optional delay to avoid overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    }

    console.log(`Se insertaron ${totalTasksInserted} tareas en total.`);
    console.log("Seed completado con éxito.");
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  } finally {
    await sql.end(); // Ensure PostgreSQL connection is properly closed
  }
};

main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});
