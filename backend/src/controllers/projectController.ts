import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

import { ProjectService } from "../services/projectService.js";
import { CreateProjectRequest, UpdateProjectRequest } from "../types/index.js";

export class ProjectController {
  private projectService: ProjectService;

  constructor(fastify: FastifyInstance) {
    this.projectService = new ProjectService(fastify);
  }

  async getAllProjects(request: FastifyRequest, reply: FastifyReply) {
    try {
      const projects = await this.projectService.getAllProjects();
      return reply.send(projects);
    } catch (error) {
      return reply.send([]);
    }
  }

  async getProjectById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const project = await this.projectService.getProjectById(id);
    return reply.send(project);
  }

  async createProject(
    request: FastifyRequest<{ Body: CreateProjectRequest }>,
    reply: FastifyReply
  ) {
    const project = await this.projectService.createProject(request.body);
    return reply.status(201).send(project);
  }

  async updateProject(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateProjectRequest;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const project = await this.projectService.updateProject(id, request.body);
    return reply.send(project);
  }

  async deleteProject(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    await this.projectService.deleteProject(id);
    return reply.status(204).send();
  }
}
