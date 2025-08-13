import type { FastifyInstance } from "fastify";

import { ProjectController } from "../controllers/projectController.js";
import { CreateProjectRequest, UpdateProjectRequest } from "../types";

export async function projectRoutes(fastify: FastifyInstance) {
  const projectController = new ProjectController(fastify);

  fastify.get(
    "/projects",
    projectController.getAllProjects.bind(projectController)
  );

  fastify.get<{ Params: { id: string } }>(
    "/projects/:id",
    projectController.getProjectById.bind(projectController)
  );

  fastify.post<{ Body: CreateProjectRequest }>(
    "/projects",
    { onRequest: [fastify.authenticate] },
    projectController.createProject.bind(projectController)
  );

  fastify.put<{ Params: { id: string }; Body: UpdateProjectRequest }>(
    "/projects/:id",
    { onRequest: [fastify.authenticate] },
    projectController.updateProject.bind(projectController)
  );

  fastify.delete<{ Params: { id: string } }>(
    "/projects/:id",
    { onRequest: [fastify.authenticate] },
    projectController.deleteProject.bind(projectController)
  );
}
