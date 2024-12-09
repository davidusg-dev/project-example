import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "~/env";

const sql = neon(env.DATABASE_URL);
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
    title: `${taskTitle}`,
    completed: Math.random() > 0.7, // ~30% completed randomly
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

    // Insert projects
    const insertedProjects = await db
      .insert(schema.projects)
      .values(
        projectNames.map((name) => ({
          name,
        })),
      )
      .returning();

    console.log(`Se insertaron ${insertedProjects.length} proyectos.`);

    let totalTasksInserted = 0;

    // For each project, create 10 tasks
    for (const project of insertedProjects) {
      const projectTasks = generateTasksForProject(project.name);
      const inserted = await db
        .insert(schema.tasks)
        .values(
          projectTasks.map((task) => ({
            projectId: project.id,
            title: task.title,
            completed: task.completed,
          })),
        )
        .returning();

      totalTasksInserted += inserted.length;
    }

    console.log(`Se insertaron ${totalTasksInserted} tareas en total.`);
    console.log("Seed completado con éxito.");
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
